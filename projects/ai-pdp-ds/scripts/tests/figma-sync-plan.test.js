import test from 'node:test';
import assert from 'node:assert/strict';
import { createSyncPlan, readTokenSources } from '../figma-sync-plan.js';

const primitive = {
  name: 'spacers',
  collection: '_spacers',
  tree: { base: { $type: 'number', $value: 8 } },
};
const semantic = {
  name: 'spacing',
  collection: 'spacing',
  tree: { gap: { $type: 'number', $value: '{spacers.base}' } },
};
const empty = { variables: {}, variableCollections: {} };

test('new collections and variables use valid cross-collection aliases and temporary IDs', () => {
  const { payload } = createSyncPlan([semantic, primitive], empty);
  const gap = payload.variables.find((v) => v.name === 'gap');
  const base = payload.variables.find((v) => v.name === 'base');
  assert.deepEqual(payload.variableModeValues.find((v) => v.variableId === gap.id).value, {
    type: 'VARIABLE_ALIAS',
    id: base.id,
  });
  assert.equal(payload.variableCollections.length, 2);
  assert.ok(payload.variables.every((v) => v.action === 'CREATE'));
});

test('unchanged existing IDs, bindings and values are preserved', () => {
  const snapshot = {
    variableCollections: {
      c: {
        id: 'c',
        name: '_spacers',
        defaultModeId: 'm',
        modes: [{ modeId: 'm', name: 'Default' }],
      },
    },
    variables: {
      v: {
        id: 'v',
        name: 'base',
        variableCollectionId: 'c',
        resolvedType: 'FLOAT',
        valuesByMode: { m: 8 },
      },
    },
  };
  assert.deepEqual(createSyncPlan([primitive], snapshot).payload, {
    variableCollections: [],
    variableModes: [],
    variables: [],
    variableModeValues: [],
  });
  const changed = structuredClone(primitive);
  changed.tree.base.$value = 12;
  const plan = createSyncPlan([changed], snapshot).payload;
  assert.deepEqual(plan.variableModeValues, [{ variableId: 'v', modeId: 'm', value: 12 }]);
  assert.equal(plan.variables.length, 0);
});

test('shared variable IDs span modes and names normalize to existing Figma modes', () => {
  const plan = createSyncPlan(
    [
      {
        name: 'colors',
        collection: 'colors',
        mode: 'light-theme',
        tree: { text: { $type: 'color', $value: '#ffffff' } },
      },
      {
        name: 'colors',
        collection: 'colors',
        mode: 'dark-theme',
        tree: { text: { $type: 'color', $value: '#00000080' } },
      },
    ],
    empty,
  ).payload;
  assert.equal(plan.variables.length, 1);
  assert.equal(new Set(plan.variableModeValues.map((v) => v.modeId)).size, 2);
  assert.equal(plan.variableModeValues[1].value.a, 128 / 255);
});

test('invalid aliases, cycles and immutable type changes fail before producing a plan', () => {
  assert.throws(() => createSyncPlan([semantic], empty), /alias/);
  assert.throws(
    () =>
      createSyncPlan(
        [
          {
            name: 'x',
            collection: 'x',
            tree: {
              a: { $type: 'number', $value: '{x.b}' },
              b: { $type: 'number', $value: '{x.a}' },
            },
          },
        ],
        empty,
      ),
    /cycle/,
  );
  assert.throws(
    () =>
      createSyncPlan([primitive], {
        variableCollections: {
          c: {
            id: 'c',
            name: '_spacers',
            defaultModeId: 'm',
            modes: [{ modeId: 'm', name: 'Default' }],
          },
        },
        variables: {
          v: { id: 'v', name: 'base', variableCollectionId: 'c', resolvedType: 'STRING' },
        },
      }),
    /Type mismatch/,
  );
});

test('all repository variable tokens can be planned offline; effect styles are explicitly omitted', async () => {
  const plan = createSyncPlan(await readTokenSources(), empty);
  assert.ok(plan.payload.variables.length > 500);
  assert.ok(plan.warnings.some((w) => w.includes('effects')));
  assert.ok(
    !Object.values(plan.payload)
      .flat()
      .some((operation) => operation.action === 'DELETE'),
  );
});
