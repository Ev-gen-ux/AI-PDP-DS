import { spawnSync } from 'node:child_process';
import { stripVTControlCharacters } from 'node:util';
import {
  mkdirSync,
  writeFileSync,
  appendFileSync,
  realpathSync,
  readFileSync,
  rmSync,
} from 'node:fs';

import { fileURLToPath } from 'node:url';
import { parseOptions, buildPlan, runComponentReport, fullChecks } from './component-quality.js';

export function runFullReport() {
  mkdirSync('.local/quality', { recursive: true });
  for (const file of ['coverage/test-results.json', 'coverage/coverage-summary.json'])
    rmSync(file, { force: true });
  const checks = fullChecks;
  const results = [];
  for (const name of checks) {
    console.log(`Checking ${name}...`);
    const start = Date.now();
    const result = spawnSync('npm', ['run', ...(name === 'env:check' ? ['--silent'] : []), name], {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });
    const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}\n${result.error?.message ?? ''}`;
    writeFileSync(`.local/quality/${name.replaceAll(':', '-')}.log`, log);
    let passed = result.status === 0;
    if (name === 'env:check') {
      let environment;
      try {
        environment = JSON.parse(result.stdout);
      } catch {
        environment = {
          passed: false,
          error: 'No structured environment output; see env-check.log',
        };
      }
      passed = passed && environment?.passed === true && Array.isArray(environment.checks);
      writeFileSync('.local/quality/environment.json', JSON.stringify(environment, null, 2) + '\n');
    }
    results.push({
      name,
      passed,
      seconds: Math.round((Date.now() - start) / 100) / 10,
      exitCode: result.status,
      problem: passed ? undefined : stripVTControlCharacters(log).slice(-1800),
    });
  }
  const gitRevision = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' });
  const gitStatus = spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
  const revision = gitRevision.status === 0 ? gitRevision.stdout.trim() : null;
  const workingTreeDirty = gitStatus.status === 0 ? Boolean(gitStatus.stdout.trim()) : null;
  let projectName = 'Design system';
  try {
    projectName = JSON.parse(readFileSync('package.json', 'utf8')).name ?? projectName;
  } catch {
    // A missing manifest is already reported by the relevant checks.
  }
  const report = {
    revision,
    workingTreeDirty,
    generatedAt: new Date().toISOString(),
    node: process.version,
    passed: results.every((r) => r.passed),
    results,
  };
  let markdown = `# ${projectName} — quality report\n\nCommit: \`${revision ?? 'unavailable'}\`${workingTreeDirty === null ? ' (working tree unverified)' : workingTreeDirty ? ' + local changes' : ''} · Node ${process.version} · ${report.generatedAt}\n\n| Check | Result | Seconds |\n| --- | --- | --- |\n${results.map((r) => `| ${r.name} | ${r.passed ? 'PASS' : 'FAIL'} | ${r.seconds} |`).join('\n')}\n`;
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
}

export function main(args = process.argv.slice(2)) {
  try {
    const options = parseOptions(args);
    if (options.help) {
      console.log(
        'npm run quality:report -- [--component Button --change docs|logic|visual] [--plan]',
      );
      return;
    }
    if (!options.component && !options.plan) return runFullReport();
    const plan = buildPlan(process.cwd(), options);
    console.log(JSON.stringify(plan, null, 2));
    if (!options.plan) return runComponentReport(process.cwd(), plan);
  } catch (error) {
    console.error(`Quality report: ${error.message}`);
    process.exitCode = 1;
  }
}
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
