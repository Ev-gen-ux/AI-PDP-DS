import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  rmSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  cpSync,
  existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { templateSection, initJournal } from '../environment/journal.js';
import { createProject } from '../environment/projects.js';
import { installTooling } from '../environment/tooling.js';

const factory = process.cwd();
function temporary(t) {
  const root = mkdtempSync(join(tmpdir(), 'ds-template-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test('sections extract standalone Markdown while rejecting ambiguous and nested sources', () => {
  const source =
    '<!-- TEMPLATE:brief:START -->\n````markdown\n# Brief\n\n<!-- BRIEF:DRAFT -->\n```sh\nnpm test\n```\n````\n<!-- TEMPLATE:brief:END -->\n';
  assert.equal(
    templateSection(source, 'brief'),
    '# Brief\n\n<!-- BRIEF:DRAFT -->\n```sh\nnpm test\n```\n',
  );
  for (const invalid of [
    source + source,
    source.replace(':END', ':BAD'),
    source.replace('# Brief', '<!-- TEMPLATE:other:START -->'),
    source.replace('````markdown', '```markdown'),
    source.replace('```sh\nnpm test\n```', '````\noutside block\n````'),
  ])
    assert.throws(() => templateSection(invalid, 'brief'), /template section/i);
  assert.throws(() => templateSection(source, 'missing'), /Missing/);
});

test('factory tasks use consolidated forms and do not bypass a damaged book through legacy files', (t) => {
  const root = temporary(t);
  cpSync(join(factory, 'templates'), join(root, 'templates'), { recursive: true });
  const project = { root, id: 'example' };
  const task = initJournal(project, 'add-input', { component: 'input' });
  assert.match(readFileSync(join(root, task.state.spec.path), 'utf8'), /Numeric Map/);
  assert.match(readFileSync(join(root, task.state.spec.path), 'utf8'), /Component Spec: input/);
  assert.equal(
    readFileSync(join(root, task.state.brief.path), 'utf8').includes('TEMPLATE:'),
    false,
  );
  const book = join(root, 'templates/specifications.md');
  writeFileSync(
    book,
    readFileSync(book, 'utf8').replace(
      '## Назначение и ожидаемый результат',
      '```\nOutside block\n```',
    ),
  );
  assert.throws(
    () => initJournal(project, 'bad-fence', { component: 'bad-fence' }),
    /closing fence/,
  );
  assert.equal(existsSync(join(root, 'component-specs/bad-fence')), false);
  writeFileSync(join(root, 'templates/specifications.md'), 'damaged');
  writeFileSync(join(root, 'templates/brief.md'), '# Legacy\n<!-- BRIEF:DRAFT -->');
  assert.throws(() => initJournal(project, 'bad', { component: 'button' }), /template section/i);
  assert.equal(existsSync(join(root, 'component-specs/button')), false);
});

test('legacy standalone templates remain supported without a source book', (t) => {
  const root = temporary(t);
  mkdirSync(join(root, 'templates'));
  writeFileSync(join(root, 'templates/brief.md'), '# Custom {{id}}\n<!-- BRIEF:DRAFT -->\n');
  const task = initJournal({ root, id: 'legacy' }, 'repair');
  assert.match(readFileSync(join(root, task.state.brief.path), 'utf8'), /Custom repair/);
});

test('broken manifest sections fail before installing any project files', (t) => {
  const source = temporary(t),
    root = createProject(temporary(t), 'alpha').root;
  cpSync(join(factory, 'templates'), join(source, 'templates'), { recursive: true });
  cpSync(join(factory, 'scripts'), join(source, 'scripts'), { recursive: true });
  const manifest = join(source, 'templates/project/tooling.json');
  const kit = JSON.parse(readFileSync(manifest));
  kit.files.at(-1).section = 'missing';
  writeFileSync(manifest, JSON.stringify(kit));
  const before = readFileSync(join(root, 'system.json'));
  assert.throws(() => installTooling(source, root), /template section/i);
  assert.equal(existsSync(join(root, 'scripts')), false);
  assert.deepEqual(readFileSync(join(root, 'system.json')), before);
});
