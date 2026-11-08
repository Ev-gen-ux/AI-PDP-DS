import { useState, type CSSProperties } from 'react';
import styled from 'styled-components';
import { theme } from '../../src/theme/tokens';
import catalog from 'virtual:foundation-catalog';
import type { TokenRecord } from '../../scripts/foundations-catalog';

const Root = styled.main`
  box-sizing: border-box;
  min-height: 100vh;
  padding: ${theme.spacing.paddings.section};
  color: ${theme.colors.text.base};
  background: ${theme.colors.background.global.calm};
  font-family: ${theme.typography.fontFamily.text};
  font-size: ${theme.typography.fontSize.text.base};
  line-height: ${theme.typography.lineHeight.text.base};
  overflow-wrap: anywhere;
  h1 {
    font-size: ${theme.typography.fontSize.heading.h2};
    line-height: ${theme.typography.lineHeight.heading.h2};
  }
  h2 {
    font-size: ${theme.typography.fontSize.heading.h4};
    line-height: ${theme.typography.lineHeight.heading.h4};
  }
  h1,
  h2 {
    font-weight: ${theme.typography.fontWeight.semiBold};
  }
  p {
    max-width: 80ch;
  }
  code {
    font-family: ${theme.typography.fontFamily.monospace};
    font-size: ${theme.typography.fontSize.text.small};
  }
  a {
    color: inherit;
    text-underline-offset: 0.2em;
  }
  input:focus-visible,
  a:focus-visible {
    outline: 2px solid ${theme.colors.focus.ring.default};
    outline-offset: 2px;
  }
  input {
    accent-color: ${theme.colors.focus.ring.default};
  }
`;
const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.inner.grouped};
  margin-block: ${theme.spacing.outer.grouped};
  label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${theme.spacing.inner.related};
  }
  input[type='search'] {
    font: inherit;
    color: inherit;
    background: ${theme.colors.background.global.calm};
    padding: ${theme.spacing.paddings.compactSmall};
    border: 1px solid currentColor;
    border-radius: ${theme.borderRadius.componentInner};
    max-width: 100%;
    box-sizing: border-box;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 28em), 1fr));
  gap: ${theme.spacing.outer.related};
`;
const Card = styled.article`
  min-width: 0;
  border: 1px solid currentColor;
  border-radius: ${theme.borderRadius.containerBase};
  padding: ${theme.spacing.paddings.default};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.inner.related};
  h3,
  p {
    margin: 0;
  }
  h3 {
    font-size: inherit;
  }
  ul {
    padding-inline-start: ${theme.spacing.paddings.default};
    margin: 0;
  }
  summary {
    cursor: pointer;
  }
  small {
    font-size: ${theme.typography.fontSize.text.small};
  }
`;
const Sample = styled.div`
  box-sizing: border-box;
  min-height: ${theme.spacing.height['2xLarge']};
  padding: ${theme.spacing.paddings.default};
  border-radius: ${theme.borderRadius.componentInner};
  display: flex;
  align-items: center;
  overflow: auto;
`;

export type Page =
  | 'overview'
  | 'palette'
  | 'primitives'
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'borderRadius'
  | 'effects'
  | 'reference';
const pages: Record<Page, { title: string; description: string }> = {
  overview: {
    title: 'Foundations',
    description:
      'Визуальный фундамент AI-PDP-DS: существующие токены, их связи и использование в реализации библиотеки.',
  },
  palette: {
    title: 'Color Palette',
    description:
      'Примитивы палитры, связанные с используемыми семантическими цветами. В компонентах применяйте семантические роли вместо прямого обращения к палитре.',
  },
  primitives: {
    title: 'Primitives',
    description:
      'Базовые размеры и параметры шрифтов, на которые опираются используемые семантические токены. Цветовые примитивы вынесены на страницу Color Palette.',
  },
  colors: {
    title: 'Semantic Colors',
    description:
      'Цвета с назначением в интерфейсе. Образец использует CSS-переменную текущей темы; таблица значений показывает light и dark из исходных токенов.',
  },
  typography: {
    title: 'Typography',
    description:
      'Параметры текста, используемые библиотекой. Образцы адаптируются к ширине viewport через действующие CSS-переменные. XL, MD и XS рядом — значения из исходников, а не переключение темы.',
  },
  spacing: {
    title: 'Spacing',
    description:
      'inner — расстояния внутри компонента; outer — между компонентами и секциями; paddings — внутренние отступы контейнеров; height — высоты. Прочие группы сохраняют имена из исходников.',
  },
  borderRadius: {
    title: 'Border Radius',
    description:
      'Радиусы, используемые в реализации. Каждый образец применяет соответствующую переменную темы.',
  },
  effects: {
    title: 'Shadows',
    description:
      'Тени, для которых найдены ссылки в реализации компонентов. Образцы используют существующие токены эффектов без дополнительных теней.',
  },
  reference: {
    title: 'Token Reference',
    description:
      'Поиск по используемым токенам: имя, CSS-переменная, исходное значение, зависимость и места использования. Токены без найденных ссылок перечислены в отчёте аудита.',
  },
};

function value(token: TokenRecord) {
  return token.values.base ?? token.values.light ?? token.values.xl ?? '';
}

function sampleStyle(token: TokenRecord): CSSProperties {
  const css = `var(${token.cssVar})`;
  if (token.type === 'color') return { background: css };
  if (token.type === 'shadow') return { boxShadow: css, margin: theme.spacing.outer.related };
  if (token.category === 'borderRadius')
    return { borderRadius: css, border: '1px solid currentColor' };
  if (token.id.includes('fontFamily')) return { fontFamily: css };
  if (token.id.includes('fontWeight')) return { fontWeight: css };
  if (token.id.includes('fontSize')) return { fontSize: css, lineHeight: 'normal' };
  if (token.id.includes('lineHeight')) return { lineHeight: css, display: 'block' };
  return {};
}

function TokenSample({ token }: { token: TokenRecord }) {
  if (token.category === 'spacing' || token.id.startsWith('spacers.')) {
    if (token.id.endsWith('columnCount')) return <p>Количество колонок: {value(token)}</p>;
    return (
      <Sample aria-label={`Размер ${token.id}`}>
        <span
          style={{
            display: 'block',
            flexShrink: 0,
            width: `var(${token.cssVar})`,
            height: theme.spacing.height.small,
            background: theme.colors.text.base,
          }}
        />
      </Sample>
    );
  }
  return (
    <Sample style={sampleStyle(token)} aria-label={`Образец ${token.id}`}>
      {token.type === 'color' ? null : token.type === 'shadow' ? (
        'Поверхность'
      ) : token.category === 'borderRadius' ? (
        'Радиус'
      ) : (
        <>
          Дизайн-система · Aa 0123
          <br />
          Текст интерфейса
        </>
      )}
    </Sample>
  );
}

function TokenCard({ token }: { token: TokenRecord }) {
  const links = token.direct.length ? token.direct : token.candidates;
  const status = token.direct.length
    ? 'Прямая ссылка'
    : token.candidates.length
      ? 'Динамический выбор / ветка темы'
      : 'Зависимость семантического токена';
  return (
    <Card>
      <small>
        {token.category} · {status}
      </small>
      <h3>
        <code>{token.id}</code>
      </h3>
      <TokenSample token={token} />
      <div>
        {Object.entries(token.values).map(([mode, resolved]) => (
          <div key={mode}>
            <strong>{mode.toUpperCase()}</strong> <code>{resolved}</code>
          </div>
        ))}
      </div>
      <code>{`var(${token.cssVar})`}</code>
      {!token.primitive && (
        <code>{`theme${token.id
          .split('.')
          .map((part) => `[${JSON.stringify(part)}]`)
          .join('')}`}</code>
      )}
      <details>
        <summary>Источник и использование</summary>
        {Object.entries(token.raw).map(([mode, raw]) => (
          <p key={mode}>
            <small>
              {mode}: <code>{raw}</code>
            </small>
          </p>
        ))}
        <ul>
          {token.sources.map((source) => (
            <li key={source}>
              <code>{source}</code>
            </li>
          ))}
        </ul>
        <ul>
          {links.map((ref) => (
            <li key={`${ref.file}:${ref.line}`}>
              <a
                href={`https://github.com/Ev-gen-ux/AI-PDP-DS/blob/main/${ref.file}#L${ref.line}`}
                target="_blank"
                rel="noreferrer"
              >
                <code>
                  {ref.file}:{ref.line}
                </code>
              </a>
            </li>
          ))}
        </ul>
        {!!token.dependencies.length && (
          <>
            <p>Ссылки из семантики:</p>
            <ul>
              {token.dependencies.map((id) => (
                <li key={id}>
                  <code>{id}</code>
                </li>
              ))}
            </ul>
          </>
        )}
      </details>
    </Card>
  );
}

export function Catalog({ page }: { page: Page }) {
  return <CatalogPage key={page} page={page} />;
}

function CatalogPage({ page }: { page: Page }) {
  const [search, setSearch] = useState('');
  const [includeCandidates, setIncludeCandidates] = useState(false);
  const byId = new Map(catalog.tokens.map((token) => [token.id, token]));
  const selected = catalog.tokens.filter((token) => {
    const dependencyUsed = token.dependencies.some((id) => {
      const target = byId.get(id);
      return (
        target && (target.direct.length > 0 || (includeCandidates && target.candidates.length > 0))
      );
    });
    const used =
      token.direct.length > 0 ||
      dependencyUsed ||
      (includeCandidates && token.candidates.length > 0);
    if (!used) return false;
    if (page === 'reference') return true;
    if (page === 'palette') return token.id.startsWith('palette.');
    if (page === 'primitives') return token.primitive && !token.id.startsWith('palette.');
    return token.category === page;
  });
  const shown = selected.filter((token) =>
    `${token.id} ${token.cssVar} ${Object.values(token.values).join(' ')} ${Object.values(token.raw).join(' ')}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <Root>
      <small>AI-PDP-DS / Foundation</small>
      <h1>{pages[page].title}</h1>
      <p>{pages[page].description}</p>
      {page === 'overview' ? (
        <>
          <h2>Примитив → семантика → компонент</h2>
          <p>
            Примитив хранит базовое значение. Семантический токен задаёт его роль. Компонент
            обращается к роли через theme и CSS-переменную. Числа и цвета в этом каталоге
            вычисляются из текущих JSON в tokens/ той же нормализацией, что используется при сборке
            темы.
          </p>
          <Grid>
            {(Object.keys(pages) as Page[])
              .filter((key) => key !== 'overview')
              .map((key) => (
                <Card key={key}>
                  <h2>
                    <a
                      target="_top"
                      href={`./?path=/story/foundation-${({ palette: 'color-palette', primitives: 'primitives', colors: 'semantic-colors', typography: 'typography', spacing: 'spacing', borderRadius: 'border-radius', effects: 'shadows', reference: 'token-reference' } as const)[key as Exclude<Page, 'overview'>]}--default`}
                    >
                      {pages[key].title}
                    </a>
                  </h2>
                  <p>{pages[key].description}</p>
                </Card>
              ))}
          </Grid>
          <h2>Как читать результаты аудита</h2>
          <p>
            Проанализировано {catalog.sourceFiles} файлов реализации. Прямая ссылка подтверждает
            обращение в коде. Динамический выбор показывает возможное использование ветки темы, но
            не доказывает, что каждый её токен достигается при выполнении. Примитивы показаны через
            зависимости используемой семантики.
          </p>
          <p>
            Тесты, stories и эта витрина исключены из анализа. Алиасы объекта theme и вычисляемые
            имена CSS-переменных требуют ручной проверки. Отсутствие найденной ссылки не означает,
            что токен нужно удалить.
          </p>
          <p>
            Переключайте Theme в панели Storybook и меняйте viewport для проверки адаптивной
            типографики. Каталог пересчитывается при запуске и сборке Storybook. После изменения
            исходников перезапустите dev-сервер.
          </p>
          <a href="https://github.com/Ev-gen-ux/AI-PDP-DS/blob/main/docs/foundations-audit.md">
            Полный отчёт аудита и ограничения метода
          </a>
        </>
      ) : (
        <>
          <Toolbar>
            <label>
              Поиск токена
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Имя, переменная или значение"
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={includeCandidates}
                onChange={(event) => setIncludeCandidates(event.target.checked)}
              />
              Включать динамические ссылки
            </label>
          </Toolbar>
          <p role="status">
            Показано {shown.length} из {selected.length}. Образцы — текущая тема и viewport;
            значения рядом — исходные режимы.
          </p>
          {includeCandidates && (
            <p>
              <small>
                Динамическая ссылка — кандидат, не подтверждение каждого варианта. Примитивы
                включают зависимости таких кандидатов.
              </small>
            </p>
          )}
          <Grid>
            {shown.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </Grid>
          {!shown.length && <p>Нет токенов по выбранным условиям.</p>}
        </>
      )}
    </Root>
  );
}
