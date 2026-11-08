import { spawnSync } from 'node:child_process';
import { stripVTControlCharacters } from 'node:util';
import { mkdirSync, writeFileSync, appendFileSync, readFileSync, rmSync } from 'node:fs';

mkdirSync('.local/quality', { recursive: true });
for (const file of ['coverage/test-results.json', 'coverage/coverage-summary.json'])
  rmSync(file, { force: true });
const checks = [
  'tokens:build',
  'typecheck',
  'lint',
  'format:check',
  'test:coverage',
  'test:tooling',
  'build',
  'package:check',
  'storybook:build',
  'figma:check',
];
const results = [];
for (const name of checks) {
  console.log(`Checking ${name}...`);
  const start = Date.now();
  const result = spawnSync('npm', ['run', name], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}\n${result.error?.message ?? ''}`;
  writeFileSync(`.local/quality/${name.replaceAll(':', '-')}.log`, log);
  results.push({
    name,
    passed: result.status === 0,
    seconds: Math.round((Date.now() - start) / 100) / 10,
    exitCode: result.status,
    problem: result.status === 0 ? undefined : stripVTControlCharacters(log).slice(-1800),
  });
}
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout?.trim();
const workingTreeDirty = Boolean(
  spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).stdout?.trim(),
);
const report = {
  revision,
  workingTreeDirty,
  generatedAt: new Date().toISOString(),
  node: process.version,
  passed: results.every((r) => r.passed),
  results,
};
let markdown = `# AI-PDP-DS — quality report\n\nCommit: \`${revision}\`${workingTreeDirty ? ' + local changes' : ''} · Node ${process.version} · ${report.generatedAt}\n\n| Check | Result | Seconds |\n| --- | --- | --- |\n${results.map((r) => `| ${r.name} | ${r.passed ? 'PASS' : 'FAIL'} | ${r.seconds} |`).join('\n')}\n`;
for (const r of results.filter((r) => !r.passed))
  markdown += `\n## ${r.name}\n\n\`\`\`text\n${r.problem}\n\`\`\`\n`;
try {
  const tests = JSON.parse(readFileSync('coverage/test-results.json', 'utf8'));
  markdown += `\nTests: ${tests.numPassedTests}/${tests.numTotalTests} passed.\n`;
} catch {
  markdown += '\nTest counts unavailable; see test:coverage log.\n';
}
try {
  const coverage = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8')).total;
  markdown += `\nCoverage: statements ${coverage.statements.pct}%, branches ${coverage.branches.pct}%, functions ${coverage.functions.pct}%, lines ${coverage.lines.pct}%.\n`;
} catch {
  markdown += '\nCoverage summary unavailable.\n';
}
markdown +=
  '\nThis report verifies automated checks only. It does not certify Figma visual parity, all accessibility requirements, or successful external publication. Logs and JSON are attached as workflow artifacts.\n';
writeFileSync('.local/quality/report.json', JSON.stringify(report, null, 2));
writeFileSync('.local/quality/report.md', markdown);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
console.log(markdown);
if (!report.passed) process.exitCode = 1;
