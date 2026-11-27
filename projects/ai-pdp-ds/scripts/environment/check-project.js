import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectContext, safePath } from './project.js';
import { linked } from './links.js';
export function checkProject(start = process.cwd()) {
  const findings = [],
    checks = [];
  let project;
  const run = (code, fn) => {
    try {
      fn();
      checks.push({ code, passed: true });
    } catch (error) {
      checks.push({ code, passed: false });
      findings.push({ code, message: error.message });
    }
  };
  run('project', () => {
    project = projectContext(start);
    if (project.environment) throw Error('Select a standalone design-system project');
  });
  if (project) {
    const root = project.root;
    run('local-tooling', () => {
      const pkg = JSON.parse(readFileSync(safePath(root, 'package.json'), 'utf8'));
      if (pkg.type !== 'module') throw Error('Project tooling requires type=module');
      for (const path of [
        'scripts/environment/journal.js',
        'scripts/environment/project.js',
        'scripts/environment/links.js',
      ])
        safePath(root, path);
    });
    run('documentation-links', () => {
      const scan = (folder) => {
        if (!existsSync(safePath(root, folder, true))) return;
        for (const entry of readdirSync(safePath(root, folder), { withFileTypes: true })) {
          const path = folder + '/' + entry.name;
          safePath(root, path);
          if (entry.isDirectory()) {
            if (entry.name !== 'history') scan(path);
          } else if (entry.name.endsWith('.md')) linked(root, path);
        }
      };
      for (const path of ['AGENTS.md', 'README.md'])
        if (existsSync(safePath(root, path, true))) linked(root, path);
      for (const folder of ['docs', 'component-specs', 'product-discovery']) scan(folder);
    });
  }
  return {
    passed: !findings.length,
    checks,
    findings,
    scope: 'project-tooling-and-document-links',
    limitations: [
      'No source build, dependency installation, browser review or handoff proof',
      'History revisions and task contents are not automatically validated',
    ],
  };
}
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 2) throw Error('env:check accepts no options; run from the project');
    const report = checkProject(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
