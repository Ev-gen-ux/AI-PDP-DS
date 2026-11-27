import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import ts from 'typescript';
import { normalizeCssValue } from './style-dictionary.config.js';

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return groups.flat().sort();
};

export function flattenTokens(tree, path = []) {
  return Object.entries(tree).flatMap(([key, node]) => {
    const next = [...path, key];
    if (node && typeof node === 'object' && '$value' in node) {
      return [{ path: next.join('.'), raw: node.$value, type: node.$type }];
    }
    return node && typeof node === 'object' ? flattenTokens(node, next) : [];
  });
}

export function resolveValue(raw, primitives, trail = []) {
  if (typeof raw !== 'string' || !/^\{[^{}]+\}$/.test(raw)) return raw;
  const path = raw.slice(1, -1);
  if (trail.includes(path))
    throw new Error(`Circular token alias: ${[...trail, path].join(' → ')}`);
  const target = primitives.get(path);
  if (!target) throw new Error(`Unknown token alias: ${path}`);
  return resolveValue(target.raw, primitives, [...trail, path]);
}

// Scan executable syntax, not comments, tests, stories or generated documentation.
// Dynamic subscripts are candidates, not proof that every member is used at runtime.
export function findReferences(source, file) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const references = [];
  function chain(node) {
    if (ts.isIdentifier(node) && node.text === 'theme') return [];
    if (ts.isPropertyAccessExpression(node)) {
      const parent = chain(node.expression);
      return parent && [...parent, node.name.text];
    }
    if (ts.isElementAccessExpression(node)) {
      const parent = chain(node.expression);
      if (!parent) return null;
      const arg = node.argumentExpression;
      return [
        ...parent,
        arg && (ts.isStringLiteral(arg) || ts.isNumericLiteral(arg)) ? arg.text : '*',
      ];
    }
    return null;
  }
  function visit(node) {
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const outer = node.parent;
      const partOfChain =
        (ts.isPropertyAccessExpression(outer) || ts.isElementAccessExpression(outer)) &&
        outer.expression === node;
      if (!partOfChain) {
        const path = chain(node);
        if (path?.length)
          references.push({
            path,
            file,
            line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1,
          });
      }
    }
    if (
      ts.isStringLiteralLike(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      for (const match of node.text.matchAll(/var\((--[\w-]+)/g)) {
        references.push({
          cssVar: match[1],
          file,
          line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1,
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return references;
}

export async function createCatalog(root) {
  const primitiveFiles = await walk(resolve(root, 'tokens/primitives'));
  const semanticFiles = await walk(resolve(root, 'tokens/semantic'));
  const primitiveTokens = (
    await Promise.all(
      primitiveFiles
        .filter((p) => p.endsWith('.json'))
        .map(async (file) =>
          flattenTokens(JSON.parse(await readFile(file, 'utf8'))).map((token) => ({
            ...token,
            source: relative(root, file),
          })),
        ),
    )
  ).flat();
  const primitives = new Map(primitiveTokens.map((token) => [token.path, token]));
  const records = new Map();
  const add = (token, category, mode, source, path) => {
    const id = path.join('.');
    const record = records.get(id) ?? {
      id,
      category,
      primitive: category === 'primitives',
      cssVar: `--${path.join('-')}`,
      type: token.type ?? 'unknown',
      values: {},
      raw: {},
      sources: [],
      direct: [],
      candidates: [],
      dependencies: [],
    };
    record.values[mode] = String(normalizeCssValue(path, resolveValue(token.raw, primitives)));
    record.raw[mode] = String(token.raw);
    if (!record.sources.includes(source)) record.sources.push(source);
    records.set(id, record);
  };
  for (const token of primitiveTokens)
    add(token, 'primitives', 'base', token.source, token.path.split('.'));
  for (const file of semanticFiles.filter((p) => p.endsWith('.json'))) {
    const name = file.split('/').pop();
    const category = name.split('.')[0];
    const mode = name.startsWith('colors.')
      ? name.includes('dark')
        ? 'dark'
        : 'light'
      : name.startsWith('typography.')
        ? name.split('.')[1]
        : 'base';
    for (const token of flattenTokens(JSON.parse(await readFile(file, 'utf8')))) {
      add(token, category, mode, relative(root, file), [category, ...token.path.split('.')]);
    }
  }
  const sourceFiles = (
    await Promise.all(['src/components', 'src/layouts'].map((dir) => walk(resolve(root, dir))))
  )
    .flat()
    .filter((p) => /\.tsx?$/.test(p) && !/\.(stories|test|figma)\./.test(p));
  const references = (
    await Promise.all(
      sourceFiles.map(async (file) =>
        findReferences(await readFile(file, 'utf8'), relative(root, file)),
      ),
    )
  ).flat();
  for (const record of records.values()) {
    for (const ref of references) {
      const parts = record.id.split('.');
      const exact = ref.cssVar === record.cssVar || (ref.path && ref.path.join('.') === record.id);
      const candidate =
        ref.path &&
        ref.path.length <= parts.length &&
        ref.path.every((part, i) => part === '*' || part === parts[i]);
      if (exact || candidate) {
        const list = exact ? record.direct : record.candidates;
        if (!list.some((r) => r.file === ref.file && r.line === ref.line))
          list.push({ file: ref.file, line: ref.line });
      }
    }
  }
  // A primitive is part of the showcase only when reached from a used semantic token.
  for (const record of records.values()) {
    if (record.primitive || (!record.direct.length && !record.candidates.length)) continue;
    for (const raw of Object.values(record.raw)) {
      let value = raw;
      const seen = new Set();
      while (/^\{[^{}]+\}$/.test(value)) {
        const id = value.slice(1, -1);
        if (seen.has(id)) break;
        seen.add(id);
        const primitive = records.get(id);
        if (!primitive) break;
        if (!primitive.dependencies.includes(record.id)) primitive.dependencies.push(record.id);
        value = primitive.raw.base;
      }
    }
  }
  const tokens = [...records.values()].sort((a, b) =>
    a.id.localeCompare(b.id, 'en', { numeric: true }),
  );
  return { sourceFiles: sourceFiles.length, tokens };
}

export function auditMarkdown(catalog) {
  const lines = [
    '# Аудит Foundations',
    '',
    'Отчёт строится по JSON в `tokens/` и AST исходников `src/components/` и `src/layouts/`. Stories, тесты и Code Connect исключены, чтобы витрина не создавала собственных доказательств использования.',
    '',
    '**Прямая ссылка** — полное обращение `theme.*` или CSS `var(...)`. **Кандидат** — динамический ключ или передача ветки темы; это не доказательство использования каждого значения во время выполнения. **Зависимость** — примитив, на который ссылается используемый семантический токен. **Не найдено** — статический анализ не обнаружил ссылок; это не рекомендация удалить токен.',
    '',
    'Анализ распознаёт обращения с корнем `theme` и CSS-переменные. Произвольные алиасы, вычисляемые строки и поток данных не отслеживаются. Точное отсутствие использования требует ручной проверки.',
    '',
    `Проверено файлов реализации: ${catalog.sourceFiles}.`,
    '',
    '| Слой | Всего | Прямая ссылка | Только кандидаты | Только зависимости | Не найдено |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const category of [...new Set(catalog.tokens.map((t) => t.category))]) {
    const tokens = catalog.tokens.filter((t) => t.category === category);
    lines.push(
      `| ${category} | ${tokens.length} | ${tokens.filter((t) => t.direct.length).length} | ${tokens.filter((t) => !t.direct.length && t.candidates.length).length} | ${tokens.filter((t) => !t.direct.length && !t.candidates.length && t.dependencies.length).length} | ${tokens.filter((t) => !t.direct.length && !t.candidates.length && !t.dependencies.length).length} |`,
    );
  }
  lines.push(
    '',
    '## Нет найденных ссылок',
    '',
    ...catalog.tokens
      .filter((t) => !t.direct.length && !t.candidates.length && !t.dependencies.length)
      .map((t) => `- \`${t.id}\``),
    '',
    '## Воспроизведение',
    '',
    '`npm run foundations:audit` обновляет этот отчёт. Storybook пересчитывает каталог из исходников при запуске и сборке; после изменения токенов или компонентов перезапустите dev-сервер. Значения нормализуются той же функцией, что использует генератор темы. Исходные токены не меняются.',
    '',
  );
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const catalog = await createCatalog(root);
  await writeFile(resolve(root, 'docs/foundations-audit.md'), auditMarkdown(catalog));
  console.log(
    `Foundations: ${catalog.tokens.length} tokens, ${catalog.sourceFiles} implementation files. Report: docs/foundations-audit.md`,
  );
}
