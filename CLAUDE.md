# AI-PDP-DS · Инструкция для AI-агентов

> Этот документ — **контракт** для генерации компонентов и работы с дизайн-системой AI-PDP-DS. Любой AI-агент (Claude Code, Cursor, Copilot, Claude Desktop через Figma MCP) должен следовать этим правилам строго. Любое отклонение требует явного согласования с владельцем дизайн-системы.

---

## 1. Общие сведения

- **Название:** AI-PDP-DS
- **Репозиторий:** https://github.com/Ev-gen-ux/AI-PDP-DS
- **Основная ветка:** `main` (защищена, прямой push запрещён)
- **Источник правды для токенов:** Figma-файл [`i7T3ru2M0SyXgJeTda8f43`](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS)
- **Источник правды для компонентов:** репозиторий выше
- **Стек:** React 18 · TypeScript 5 · Vite 5 · styled-components 6 · Storybook 8

### 1.1 Setup (выполняется один раз)

Первичная инициализация репозитория уже сделана командами:

```bash
git remote add origin https://github.com/Ev-gen-ux/AI-PDP-DS.git
git branch -M main
git push -u origin main
```

Для нового разработчика onboarding такой:

```bash
git clone https://github.com/Ev-gen-ux/AI-PDP-DS.git
cd AI-PDP-DS
npm install
npm run tokens:build       # генерирует src/theme из /tokens
npm run storybook          # запускает Storybook на :6006
```

### 1.2 Git workflow

- **Ветки:** `feat/<component-name>`, `fix/<short-desc>`, `chore/<task>`, `tokens/<change>`.
- **Коммиты:** Conventional Commits. Префиксы: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `tokens:`.
- **PR в `main`:** только через Pull Request. Прямой push в `main` запрещён.
- **Версионирование:** Changesets. Каждый PR с изменением публичного API содержит файл `.changeset/*.md`.
- **AI-агенты НЕ работают в `main` напрямую.** Любой агент должен создать ветку `feat/...` и открыть PR.

## 2. Поддерживаемые темы и режимы

Система мультирежимная. На разных уровнях токенов используются разные оси:

| Уровень                   | Ось режимов     | Значения                    |
| ------------------------- | --------------- | --------------------------- |
| `colors`                  | тема            | `light theme`, `dark theme` |
| `typography`              | размер вьюпорта | `XL`, `MD`, `XS`            |
| `spacing`, `borderRadius` | —               | один режим                  |

Это значит:

- Цвета переключаются через `<ThemeProvider theme={lightTheme}>` или `<ThemeProvider theme={darkTheme}>`.
- Типографика **сама** адаптируется к ширине вьюпорта через CSS-переменные, которые переопределяются в media-query-блоках.
- Spacing и border-radius — единые для всех режимов.

---

## 3. Архитектура каталогов

```
/
├── tokens/                 ← W3C DTCG JSON, синхронизируется с Figma
│   ├── primitives/
│   │   ├── palette.json
│   │   ├── spacers.json
│   │   └── typographyBase.json
│   └── semantic/
│       ├── colors.light.json
│       ├── colors.dark.json
│       ├── typography.xl.json
│       ├── typography.md.json
│       ├── typography.xs.json
│       ├── spacing.json
│       └── borderRadius.json
├── src/
│   ├── theme/              ← сгенерировано Style Dictionary
│   │   ├── tokens.ts       ← объект для ThemeProvider
│   │   ├── variables.css   ← CSS Custom Properties (включая light/dark/responsive)
│   │   └── styled.d.ts     ← типы темы для styled-components
│   ├── components/         ← атомы: Button, Icon, Checkbox, Radio, InputText, Label, StatusLabel, Avatar, InlineMessage, Spinner
│   │   └── button/
│   │       ├── Button.tsx
│   │       ├── Button.stories.tsx
│   │       ├── Button.figma.tsx
│   │       └── index.ts
│   ├── patterns/           ← молекулы: BenefitCard, NotificationSnackbar, SidebarNavigationItem, SplitButton, ToggleButton, Stepper, Accordion, TableCell
│   ├── layouts/            ← Stack, Cluster, Grid, Sidebar, Container, Center, Switcher
│   └── templates/          ← каркасы экранов
├── docs/                   ← MDX-документация, спецификации, паттерны
├── .storybook/
└── .github/workflows/      ← CI/CD: tokens-sync, code-connect-publish, release
```

**Каждый компонент = 4 файла:** `Component.tsx` · `Component.stories.tsx` · `Component.figma.tsx` · `index.ts`. Без исключений.

---

## 4. Naming convention для токенов

Структура зеркалит Figma 1-в-1. В Figma имена через `/`, в JS-объекте через точку, в CSS через дефис.

### 4.1 Цвета: `<element>/<role>/<property>/<state>`

```
button/primary/background/enabled
button/primary/background/hover
button/primary/label/disabled
input/border/error
notification/snackbar/iconStatus/success
sidebarNavigationItem/icon/active
```

В TS:

```ts
theme.colors.button.primary.background.enabled;
theme.colors.input.border.error;
```

В CSS:

```css
var(--color-button-primary-background-enabled)
```

### 4.2 Spacing: семантические группы

- `inner/*` — отступы **внутри** компонента или между связанными элементами (`closest`, `close`, `related`, `grouped`)
- `outer/*` — отступы **между** компонентами/секциями (`close`, `related`, `grouped`, `subSection`, `section`)
- `paddings/*` — паддинги контейнеров (`xxsCompact`, `xsCompact`, `compact`, `compactMedium`, `default`, `medium`, `relaxed`, `large`, `section`)
- `height/*` — фиксированные высоты (`4xSmall`...`2xLarge`)
- `grid/*` — параметры сетки (`columnGap`, `rowGap`, `columnCount`)

**Правило выбора:** для пространства между элементами **одного** компонента — `inner`. Для пространства между разными компонентами — `outer`. Для внутренних отступов контейнера — `paddings`.

### 4.3 Border radius: по уровню вложенности

- `componentInner` (4) — внутренние элементы (галочки, чипы внутри кнопок)
- `componentBase` (8) — базовый уровень компонентов (кнопки, инпуты)
- `sectionInner` (12) — карточки внутри секций
- `containerBase` (16) — контейнеры
- `sectionBase` (24) — крупные секции
- `rounded` (999) — круглые формы (аватары, статус-точки)

### 4.4 Типографика: `<role>/<scale>`

- `fontSize/heading/h1`...`h6` — заголовки (адаптируются по XL/MD/XS)
- `fontSize/text/base`, `text/small`, `text/extraSmall` — основной текст
- `fontSize/component/base`, `component/small`, `component/extraSmall` — текст в компонентах (кнопки, лейблы)
- `fontWeight/regular`, `medium`, `semiBold`
- Аналогично для `lineHeight`

---

## 5. Палитра

| Семейство        | Назначение                          |
| ---------------- | ----------------------------------- |
| `neutral/25-900` | фоны, бордеры, текст, иконки        |
| `blue/25-900`    | основной брендовый, акценты, ссылки |
| `green/25-900`   | успех, online-статусы               |
| `red/25-900`     | ошибки, required-маркеры            |
| `yellow/25-900`  | предупреждения                      |
| `cyan/25-900`    | информационные                      |
| `pink/25-900`    | специальные акценты                 |
| `base/white`     | чистый белый (отдельно от neutral)  |

**Правило:** в коде компонентов **никогда** не используй переменные палитры напрямую (`palette.blue.500`). Только через семантические токены (`colors.button.primary.background.enabled`). Палитра — только для генерации семантики.

---

## 6. Правила стилизации компонентов

### 6.1 Жёсткие требования (нарушение блокирует merge)

1. **Только токены, никаких хардкод-значений.** Запрещены литеральные цвета (`#fff`, `rgb(...)`), литеральные размеры (`16px`, `1rem`), литеральные радиусы.
2. **Transient props с `$` префиксом** для всех стилевых пропсов: `$appearance`, `$size`, `$loading`. Native HTML-атрибуты (`disabled`, `type`, `name`) идут без `$`.
3. **`css` helper из styled-components**, не template strings.
4. **Варианты через объект-map**, не цепочки тернарников. Это даёт TS exhaustiveness check.
5. **`:focus-visible`**, не `:focus`.
6. **Mobile-first media queries:** `@media (min-width: ${theme.breakpoints.md})`.
7. **Container queries** для контентных компонентов (BenefitCard, NotificationSnackbar, TableCell — там где компонент может стоять в колонках разной ширины).
8. **Нет `!important`.** Никогда.

### 6.2 Эталонный паттерн

```tsx
import Styled, { css } from 'styled-components';

interface IButtonProps {
  appearance?: 'primary' | 'outline' | 'flat';
  size?: 'large' | 'medium';
  disabled?: boolean;
  loading?: boolean;
  iconBefore?: IconName;
  iconAfter?: IconName;
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type StyledProps = {
  $appearance: NonNullable<IButtonProps['appearance']>;
  $size: NonNullable<IButtonProps['size']>;
  $loading?: boolean;
};

const appearanceStyles = {
  primary: css`
    &:enabled {
      border: none;
      background-color: ${({ theme }) => theme.colors.button.primary.background.enabled};
      color: ${({ theme }) => theme.colors.button.primary.label.enabled};
    }
    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.button.primary.background.hover};
    }
    &:active:enabled {
      background-color: ${({ theme }) => theme.colors.button.primary.background.active};
    }
  `,
  outline: css`
    /* ... */
  `,
  flat: css`
    /* ... */
  `,
} as const;

const sizeStyles = {
  medium: css`
    height: ${({ theme }) => theme.spacing.height.large};
    padding: 0 ${({ theme }) => theme.spacing.paddings.default};
    gap: ${({ theme }) => theme.spacing.inner.related};
    font-size: ${({ theme }) => theme.typography.fontSize.component.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  `,
  large: css`
    /* ... */
  `,
} as const;

const StyledButton = Styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  margin: 0;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  transition: ${({ theme }) => theme.animation.base};

  &:focus-visible {
    box-shadow: ${({ theme }) => theme.focus};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.button.primary.background.disabled};
    color: ${({ theme }) => theme.colors.button.primary.label.disabled};
    border-color: ${({ theme }) => theme.colors.button.primary.border.disabled};
    cursor: not-allowed;
  }

  ${({ $appearance }) => appearanceStyles[$appearance]}
  ${({ $size }) => sizeStyles[$size]}
`;

export const Button: React.FC<IButtonProps> = ({
  appearance = 'primary',
  size = 'medium',
  disabled,
  loading,
  iconBefore,
  iconAfter,
  text = 'Button Label',
  onClick,
}) => {
  const iconSize = size === 'large' ? 24 : 20;
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      $appearance={appearance}
      $size={size}
      $loading={loading}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading || undefined}
      type="button"
    >
      {loading && <Spinner size={iconSize} />}
      {!loading && iconBefore && <Icon size={iconSize} iconName={iconBefore} />}
      {text}
      {!loading && iconAfter && <Icon size={iconSize} iconName={iconAfter} />}
    </StyledButton>
  );
};
```

---

## 7. Naming convention для пропсов компонентов

Единая для всей библиотеки. **Не отступать.**

| Назначение                  | Имя пропа                                    | Допустимые значения                                          |
| --------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| Визуальный вариант          | `appearance`                                 | `'primary' \| 'outline' \| 'flat' \| 'secondary'`            |
| Размер                      | `size`                                       | `'small' \| 'medium' \| 'large'`                             |
| Состояние формы             | `disabled`, `loading`, `invalid`, `readOnly` | `boolean`                                                    |
| Тип статуса                 | `status`                                     | `'success' \| 'information' \| 'alert' \| 'wait' \| 'error'` |
| Иконка слева                | `iconBefore`                                 | `IconName`                                                   |
| Иконка справа               | `iconAfter`                                  | `IconName`                                                   |
| Текст в простых компонентах | `text` или `children`                        | `string` / `React.ReactNode`                                 |
| Лейбл                       | `label`                                      | `string`                                                     |
| Описание                    | `description`                                | `string`                                                     |

Не использовать: `variant`, `kind`, `type` (для визуального варианта), `theme`, `mode`.

---

## 8. Адаптивность

### 8.1 Брейкпоинты

```ts
theme.breakpoints = {
  xs: '480px',
  md: '768px',
  xl: '1280px',
};
```

Соответствуют режимам типографики (`XS` / `MD` / `XL`).

### 8.2 Стратегия

- **Mobile-first.** Базовые стили = XS. Расширения через `@media (min-width: ...)`.
- **Layout-примитивы решают 80% задач.** Используй `Stack`, `Cluster`, `Grid`, `Sidebar` вместо собственных flex/grid в компонентах страниц.
- **Container queries** обязательны для компонентов, которые могут стоять в колонках разной ширины: BenefitCard, NotificationSnackbar, TableCell, SidebarNavigationItem, любые карточки.
- **JSON-композиции экранов не используем.** Экран = типизированный React-компонент в `src/templates/` или `src/screens/`.

### 8.3 Адаптивная типографика

CSS-переменные типографики переопределяются на брейкпоинтах:

```css
:root {
  --font-size-heading-h1: 48px; /* XL по умолчанию */
}

@media (max-width: 1279px) {
  :root {
    --font-size-heading-h1: 40px;
  } /* MD */
}

@media (max-width: 767px) {
  :root {
    --font-size-heading-h1: 32px;
  } /* XS */
}
```

Компоненты используют только `var(--font-size-heading-h1)` через `theme.typography.fontSize.heading.h1` — адаптация происходит автоматически без перерендера React.

---

## 9. Accessibility (обязательно для всех компонентов)

- Все интерактивные элементы получают видимый `:focus-visible`.
- Кнопки: `type="button"` по умолчанию (иначе сабмитят форму).
- `aria-busy={loading}` при загрузке.
- `aria-disabled` для визуально-disabled состояний без блокировки фокуса (где это нужно для tooltip).
- `aria-invalid="true"` + `aria-describedby` для полей с ошибкой.
- Modals/Drawers: focus trap, Esc для закрытия, `aria-labelledby` и `aria-describedby`.
- Tabs/Accordion: keyboard navigation (стрелки, Home, End).
- Минимум контраста WCAG AA: 4.5:1 для обычного текста, 3:1 для крупного и интерактивных границ.
- Touch target минимум 44×44px для интерактивных элементов на мобильных.

---

## 10. Storybook story (обязательно)

### 10.1 Общий принцип оформления stories

Каждый компонент в Storybook оформляется по единому шаблону:

1. `tags: ['autodocs']` обязательно.
2. В `parameters.docs.description.component` добавляется краткое описание компонента.
3. Для ключевых пропсов в `argTypes` добавляется `description` (не только control).
4. Для ключевых состояний/вариантов создаются **отдельные stories** (`Primary`, `Outline`, `Flat`, `Disabled`, `Error` и т.д.).
5. Для отдельных stories добавляется `parameters.docs.description.story`, если нужно пояснение состояния.
6. Внутренние отступы в контейнере story задаются через `decorators` и единый паттерн:

```tsx
decorators: [
  (Story) => (
    <div style={{ padding: '24px' }}>
      <Story />
    </div>
  ),
];
```

7. Если компонент не должен растягиваться на всю ширину (например, `InputText`), в декораторе задаётся фиксированная ширина обёртки:

```tsx
decorators: [
  (Story) => (
    <div style={{ padding: '24px' }}>
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    </div>
  ),
];
```

8. Не использовать фиксированную высоту `docs.story.height`, если это приводит к внутреннему скроллу в контейнере. Контейнер должен "обнимать" компонент по высоте.
9. Матрица `AllVariants` не обязательна. По текущему стандарту предпочтительны отдельные истории по каждому варианту/состоянию.

### 10.2 Минимальный пример

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    appearance: { control: 'select', options: ['primary', 'outline', 'flat'] },
    size: { control: 'select', options: ['medium', 'large'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { appearance: 'primary', text: 'Button' } };
export const Outline: Story = { args: { appearance: 'outline', text: 'Button' } };
export const Flat: Story = { args: { appearance: 'flat', text: 'Button' } };
export const Loading: Story = { args: { loading: true, text: 'Button' } };
export const Disabled: Story = { args: { disabled: true, text: 'Button' } };
```

---

## 11. Code Connect (Figma ↔ React маппинг)

Каждый компонент имеет `Component.figma.tsx`. Это связывает Figma-компонент с React-кодом и показывает корректный сниппет в Figma Dev Mode.

```tsx
// Button.figma.tsx
import { figma } from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, 'https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/?node-id=3001-15051', {
  props: {
    appearance: figma.enum('Appearance', {
      Primary: 'primary',
      Outline: 'outline',
      Flat: 'flat',
    }),
    size: figma.enum('Size', { Large: 'large', Medium: 'medium' }),
    text: figma.string('Label'),
    iconBefore: figma.boolean('Has icon before', { true: 'placeholder', false: undefined }),
    iconAfter: figma.boolean('Has icon after', { true: 'caret-down', false: undefined }),
    disabled: figma.boolean('Disabled'),
    loading: figma.boolean('Loading'),
  },
  example: ({ appearance, size, text, iconBefore, iconAfter, disabled, loading }) => (
    <Button
      appearance={appearance}
      size={size}
      iconBefore={iconBefore}
      iconAfter={iconAfter}
      disabled={disabled}
      loading={loading}
      text={text}
    />
  ),
});
```

Имена вариантов в `figma.enum` (Primary, Outline, Flat) **точно совпадают** с именами вариантов в Figma-компоненте.

---

## 12. Что НЕ делать (запреты)

1. **Не использовать литеральные значения** в стилях — только `theme.*` и CSS-переменные.
2. **Не использовать `:focus`** без `:focus-visible`.
3. **Не передавать стилевые пропсы без `$`** — будут утекать в DOM.
4. **Не создавать новые токены** без обновления `/tokens/*.json` и согласования с владельцем ДС.
5. **Не использовать `!important`.**
6. **Не писать media queries** без брейкпоинтов из `theme.breakpoints`.
7. **Не использовать переменные палитры напрямую** в компонентах. Только семантические.
8. **Не описывать экраны через JSON-схемы.** Экраны = React-компоненты с layout-примитивами.
9. **Не плодить compound-компоненты** для простых элементов (Button.Icon — нет, Modal.Header — да).
10. **Не использовать новые библиотеки стилизации** (vanilla-extract, emotion, tailwind) без согласования. Стек зафиксирован: styled-components.
11. **Не игнорировать ошибки TypeScript** через `any` или `@ts-ignore`. Тип темы должен оставаться строгим.
12. **Не править сгенерированные файлы** в `src/theme/` — они перезаписываются Style Dictionary.
13. **Не пушить напрямую в `main`.** Любые изменения — через ветку и PR.
14. **Не коммитить без Changeset** при изменении публичного API компонентов.

---

## 13. Список компонентов первой версии

Уже определены в Figma. Порядок реализации — по зависимостям.

**Атомы (`src/components/`):**

- [x] Icon — есть
- [x] Button — есть, требует рефакторинга по пунктам 6.2
- [ ] Spinner
- [ ] Avatar
- [ ] Label
- [ ] StatusLabel
- [ ] Checkbox
- [ ] Radio
- [ ] InputText
- [ ] InlineMessage

**Молекулы (`src/patterns/`):**

- [ ] BenefitCard
- [ ] NotificationSnackbar
- [ ] SidebarNavigationItem
- [ ] SplitButton
- [ ] ToggleButton
- [ ] TableCell
- [ ] Stepper
- [ ] Accordion

**Layout-примитивы (`src/layouts/`):**

- [ ] Stack — вертикальная компоновка с `gap`
- [ ] Cluster — горизонтальная компоновка с переносом
- [ ] Grid — адаптивная сетка через `repeat(auto-fit, minmax(...))`
- [ ] Sidebar — две колонки, схлопываются на узких экранах
- [ ] Container — ограничение ширины с padding
- [ ] Center — центрирование с max-width
- [ ] Switcher — горизонтальная компоновка, переключающаяся на вертикальную

---

## 14. Workflow при создании нового компонента

Когда AI-агент получает задачу "создай компонент X", шаги такие:

1. **Прочитать токены компонента в Figma** через `get_variable_defs` или `search_design_system`.
2. **Найти соответствующий узел в Figma** и забрать дизайн-контекст через `get_design_context`.
3. **Сравнить с эталонным паттерном** (раздел 6.2 этого документа).
4. **Создать ветку** `feat/<component-name>` от актуального `main`.
5. **Написать компонент** строго по правилам стилизации и naming convention.
6. **Создать story** с отдельными вариантами/состояниями компонента (без обязательного "AllVariants").
7. **Создать `.figma.tsx`** с маппингом всех вариантов и пропсов.
8. **Проверить accessibility** по чеклисту раздела 9.
9. **Запустить локально** — Storybook должен отрисовать без warnings в консоли.
10. **Создать Changeset** (`npx changeset`) если меняется публичный API.
11. **Открыть PR в `main`** с описанием по шаблону `.github/pull_request_template.md`.
12. **Дождаться зелёного CI** (lint, typecheck, test, build, visual regression).

## 15. Настройка GitHub-репозитория (требуется владельцу)

Чтобы правила выше работали не только декларативно, но и технически — на стороне GitHub настроить:

### 15.1 Branch protection rules для `main`

Settings → Branches → Add rule на `main`:

- ✅ Require a pull request before merging
- ✅ Require approvals (минимум 1)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging:
  - `lint`
  - `typecheck`
  - `test`
  - `build`
  - `chromatic` (если подключён visual regression)
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings (включая для админов)

### 15.2 Secrets для CI/CD

Settings → Secrets and variables → Actions:

- `FIGMA_ACCESS_TOKEN` — Personal Access Token из Figma (Settings → Security → Personal access tokens). Нужен для синхронизации токенов через Variables REST API и для `figma connect publish`.
- `FIGMA_FILE_KEY` — `i7T3ru2M0SyXgJeTda8f43` (можно оставить публичным как переменную, но как секрет тоже работает).
- `NPM_TOKEN` — если планируется публикация в npm registry (private или public).
- `CHROMATIC_PROJECT_TOKEN` — если используется Chromatic для visual regression.

### 15.3 GitHub Actions workflows

Создать в `.github/workflows/`:

| Файл                       | Триггер                                        | Назначение                                                |
| -------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `ci.yml`                   | PR в `main`                                    | lint, typecheck, test, build                              |
| `tokens-sync.yml`          | push в `main` с изменениями `/tokens/**`       | Style Dictionary build → push в Figma через Variables API |
| `figma-webhook.yml`        | repository_dispatch от Figma `LIBRARY_PUBLISH` | создание PR с обновлёнными токенами из Figma              |
| `code-connect-publish.yml` | push в `main` с изменениями `*.figma.tsx`      | `figma connect publish`                                   |
| `release.yml`              | push в `main` с Changesets                     | публикация npm-пакета и тегов                             |
| `chromatic.yml`            | PR в `main`                                    | visual regression для Storybook                           |

### 15.4 CODEOWNERS

Создать `.github/CODEOWNERS`:

```
*                    @Ev-gen-ux
/tokens/             @Ev-gen-ux
/src/components/     @Ev-gen-ux
/.github/            @Ev-gen-ux
/CLAUDE.md           @Ev-gen-ux
```

Это гарантирует, что любой PR требует review от владельца дизайн-системы.

---

## 16. Известные проблемы в Figma (требуют исправления)

Перед первой синхронизацией токенов в код **починить в Figma**:

- `avatar/backgroun/enabled`, `avatar/backgroun/hover`, `avatar/backgroun/active` → `background`
- `notification/snackbar/border/ssuccess` → `success`
- `notification/snackbar/discription/enabled` → `description`
- `labelStatus/secondary/background/successe` → `success`
- `labelStatus/secondary/label/sucesse` → `success`
- `ink/bakcground/calm/enabled` → `background`
- `_spacers/80` имеет значение 72 — должно быть 80 (либо переименовать токен)

Эти опечатки приедут в код буквально и засорят `theme.colors.avatar.backgroun.enabled` навсегда. Лучше починить сразу, до настройки CI.

---

## 17. Ссылки

- **Репозиторий:** https://github.com/Ev-gen-ux/AI-PDP-DS
- **Figma:** https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS
- **Issues:** https://github.com/Ev-gen-ux/AI-PDP-DS/issues
- **Pull Requests:** https://github.com/Ev-gen-ux/AI-PDP-DS/pulls
- Спецификации: `/docs/`
- Storybook (локально): `npm run storybook`
- Tokens build: `npm run tokens:build`
- Code Connect publish: `npm run figma:publish`

---

**Версия инструкции:** 1.1
**Последнее обновление:** добавлен GitHub-репозиторий и git workflow
