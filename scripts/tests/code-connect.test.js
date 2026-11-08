import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync('src/components/button/ButtonCodeConnect.figma.ts', 'utf8');
const code = ts
  .transpileModule(
    source.replace("import figma from 'figma';", "const figma = require('figma');"),
    { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } },
  )
  .outputText.replace('export default', 'globalThis.result =');
function render(properties, icons = {}) {
  const api = {
    code: (strings, ...values) =>
      strings.reduce((text, part, index) => text + part + (values[index] ?? ''), ''),
    selectedInstance: {
      getEnum: (name, mapping) => {
        assert.ok(properties[name] in mapping, `Unmapped ${name}: ${properties[name]}`);
        return mapping[properties[name]];
      },
      getString: () => 'Label',
      getBoolean: (name) => Boolean(icons[name]),
      getInstanceSwap: (name) => ({
        type: 'INSTANCE',
        executeTemplate: () => ({ example: icons[name] }),
      }),
    },
  };
  const context = { require: () => api };
  runInNewContext(code, context);
  return context.result.example;
}
for (const appearance of ['primary', 'outline', 'flat'])
  for (const size of ['large (48px)', 'medium (40px)', 'small (32px)']) {
    test(`Button snippet maps ${appearance}/${size} and loading/disabled states`, () => {
      const result = render({
        apperance: appearance,
        size,
        isDisabled: 'true',
        isLoading: 'true',
        ':state': 'disabled',
      });
      assert.ok(result.includes(`appearance="${appearance}"`));
      assert.ok(result.includes(`size="${size.split(' ')[0]}"`));
      assert.ok(result.includes('disabled'));
      assert.ok(result.includes('loading'));
      assert.ok(!result.includes('undefined'));
    });
  }
test('native interaction states do not invent a state prop; swapped icons are resolved dynamically', () => {
  for (const state of ['enabled', 'hover', 'active', 'focus']) {
    const result = render(
      {
        apperance: 'primary',
        size: 'small (32px)',
        isDisabled: 'false',
        isLoading: 'false',
        ':state': state,
      },
      {
        iconBefore: true,
        VALiconBefore: '<CustomBefore />',
        iconAfter: true,
        VALiconAfter: '<CustomAfter />',
      },
    );
    assert.ok(result.includes('iconBefore={<CustomBefore />}'));
    assert.ok(result.includes('iconAfter={<CustomAfter />}'));
    assert.ok(!result.includes('state='));
    assert.ok(!result.includes('disabled'));
  }
});
