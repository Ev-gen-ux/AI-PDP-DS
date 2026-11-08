import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';

const css = postcss.parse(readFileSync('src/theme/variables.light.css', 'utf8'));
for (const [width, expected] of [
  [1279, '40px'],
  [767, '32px'],
]) {
  test(`typography at ${width}px targets the variables used by components in both themes`, () => {
    const blocks = css.nodes.filter(
      (node) => node.type === 'atrule' && node.params === `(max-width: ${width}px)`,
    );
    assert.ok(blocks.length > 0);
    const rules = blocks.flatMap((block) => block.nodes);
    const headings = rules.filter((rule) =>
      rule.nodes?.some((decl) => decl.prop === '--typography-fontSize-heading-h1'),
    );
    assert.ok(headings.some((rule) => rule.selector.includes('[data-theme="dark"]')));
    for (const rule of headings) {
      assert.equal(
        rule.nodes.find((decl) => decl.prop === '--typography-fontSize-heading-h1').value,
        expected,
      );
      assert.ok(rule.selector.includes('[data-theme="light"]'));
    }
    assert.ok(
      !rules.some((rule) => rule.nodes?.some((decl) => decl.prop === '--fontSize-heading-h1')),
    );
  });
}
