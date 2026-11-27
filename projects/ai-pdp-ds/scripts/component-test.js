import { startVitest } from 'vitest/node';

const tests = process.argv.slice(2);
if (
  !tests.length ||
  tests.some(
    (path) =>
      !/^src\/(components|layouts)\/[A-Za-z0-9_./-]+\.test\.tsx?$/.test(path) ||
      path.split('/').includes('..'),
  )
) {
  throw new Error('Expected explicit component test files');
}
const context = await startVitest('test', [], {
  run: true,
  watch: false,
  coverage: { enabled: false },
  include: tests,
  passWithNoTests: false,
});
if (!context) process.exitCode = 1;
else await context.close();
