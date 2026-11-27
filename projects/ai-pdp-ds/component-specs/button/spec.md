# Component Spec: Button

## 1) Component Kickoff

- **Component:** `Button`; публичный тип `ButtonProps`, экспорты через `src/components/button/index.ts` и `src/index.ts`.
- **Источник текущего описания:** [реализация](../../src/components/button/Button.tsx), [stories](../../src/components/button/Button.stories.tsx), семантические JSON и действующий [Code Connect template](../../src/components/button/ButtonCodeConnect.figma.ts). База кода `cc58d2b`; документ и Default story подготовлены 26 ноября 2026.
- **Figma:** набор `button`, node `205:3332`, указан в действующем template. Локальные источники фиксируют прежнюю публикацию: [library setup](../../docs/library-setup.md#code-connect), [аудит готовности](../../product-discovery/research/readiness-audit.md). Актуальный master в этой задаче не читался; его геометрия и визуальная приёмка не подтверждены заново.
- **Stories:** `Default`, `Primary`, `Outline`, `Flat`; `Foundation/ThemeCheck` содержит три appearance, primary loading и outline disabled. Это примеры, не доказательство полного покрытия сочетаний.
- **A11y:** нативная кнопка, `type="button"` по умолчанию, `:focus-visible`, loading приводит к нативному disabled и busy; применимые требования — [accessibility](../../docs/standards/accessibility.md).
- **Границы этапа:** собрать один канонический Spec существующего компонента и базовую Default story. API, стили, mapping и поведение не меняются. Документ описывает факты реализации; пробелы визуальных требований остаются открытыми до сверки с master.

## 2) Variant Matrix и публичные свойства

| Ось / prop                            | Значения / default                              | Текущее поведение                                                                                 |
| ------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appearance`                          | `primary` (default), `outline`, `flat`          | Визуальный вес; без новой оси variant/status.                                                     |
| `size`                                | `large` (default), `medium`, `small`            | Maps размеров и типографики ниже.                                                                 |
| browser state                         | enabled, hover, active, focus-visible, disabled | Нативные псевдоклассы; публичного prop state нет. Focus-visible может сочетаться с hover/active.  |
| `disabled`                            | boolean, отсутствует по умолчанию               | Нативный disabled; также включается при loading.                                                  |
| `loading`                             | boolean, `false`                                | Вместо контента/иконок выводится Spinner; `aria-busy` и `aria-disabled` выставляются при loading. |
| `iconBefore`, `iconAfter`             | `ReactNode                                      | boolean`, отсутствуют                                                                             | `true` — fallback glyph, `false/null/undefined` — нет иконки. React element, строка или число передаются как содержимое слота; произвольный элемент не получает автоматический размер. Это фактический legacy API, а не миграция на IconName. |
| `text`, `children`                    | `text?: string`, нативный React children        | Контент `children ?? text`; при loading скрывается.                                               |
| `type`                                | button (default), нативные submit/reset         | Пробрасывается нативной кнопке.                                                                   |
| `onClick`, нативные button/ARIA props | по `ButtonProps`                                | Пробрасываются через rest; переданные ARIA props могут переопределять атрибуты реализации.        |

Отдельных props selected/invalid/readOnly в интерфейсе Button не определено. Не добавлять их по аналогии с другим компонентом. Публично экспортируется `ButtonProps`; внутренние alias-типы appearance/size отдельно не экспортируются.

## 3) Numeric Map текущей реализации

Пути относительно `theme`. Значения разрешены из JSON для профиля XL; это не замеры Figma и не гарантия браузерной геометрии. Типографика имеет отдельные MD/XS профили. Высота задана как **min-height**, padding сверху/снизу — 0, слева/справа — по таблице.

| size   | min-height                  | gap                                  | horizontal padding                    | font-size (XL)                             | line-height (XL)                            | fallback icon / Spinner, px |
| ------ | --------------------------- | ------------------------------------ | ------------------------------------- | ------------------------------------------ | ------------------------------------------- | --------------------------- |
| large  | `spacing.height.large` = 48 | `spacing.inner.grouped` = 16         | `spacing.paddings.relaxed` = 24       | `typography.fontSize.component.base` = 16  | `typography.lineHeight.component.base` = 24 | 24                          |
| medium | `spacing.height.base` = 40  | `spacing.paddings.compactSmall` = 10 | `spacing.paddings.medium` = 20        | `typography.fontSize.component.small` = 14 | `typography.lineHeight.text.small` = 20     | 16                          |
| small  | `spacing.height.small` = 32 | `spacing.inner.related` = 8          | `spacing.paddings.compactMedium` = 12 | `typography.fontSize.component.small` = 14 | `typography.lineHeight.text.small` = 20     | 16                          |

Общие значения: radius — `borderRadius.componentBase`; family — `typography.fontFamily.component`; weight — `typography.fontWeight.semiBold`. Border 1px, focus ring 2px и длительности переходов сейчас заданы литерально в коде. Эта запись фиксирует существующую реализацию, не вводит исключение из token-first и не разрешает копировать литералы в новые компоненты.

## 4) Figma → Token Map

Действующий Code Connect связывает Figma `apperance` (именно такое имя в template) с primary/outline/flat; `size` large (48px)/medium (40px)/small (32px) — с large/medium/small. `isDisabled`, `isLoading` и `:state` определяют соответствующие props, а hover/active/focus остаются нативными взаимодействиями. Текст берётся из `✏️labelTextContent`, замены иконок — из `VALiconBefore`/`VALiconAfter`.

Это сведения локального template, не свежая инспекция Figma. Таблица замер source → token → resolved value для актуального master ещё не подтверждена; для визуальной доработки сначала заполнить её по [figma](../../docs/standards/figma.md). Не объявлять числа из названий вариантов независимыми замерами.

`Button.figma.tsx` с node `3001:15051` — старая placeholder-заготовка. `figma.config.json` включает только `*.figma.ts`; действующий источник связи — `ButtonCodeConnect.figma.ts`. Старый файл не удаляется в этом этапе.

## 5) State Token Matrix

Цветовые пути относительно `theme.colors`. Для каждого appearance `A` значение `button.A.label.enabled` используется в enabled/hover/active; disabled — `button.A.label.disabled`. Иконки fallback наследуют цвет; произвольный ReactNode может задавать свой цвет. Spinner — отдельный компонент, не следует приписывать ему цвет label по этой матрице.

| appearance | state    | background                          | border                           | label                           |
| ---------- | -------- | ----------------------------------- | -------------------------------- | ------------------------------- |
| primary    | enabled  | `button.primary.background.enabled` | transparent                      | `button.primary.label.enabled`  |
| primary    | hover    | `button.primary.background.hover`   | transparent                      | `button.primary.label.enabled`  |
| primary    | active   | `button.primary.background.active`  | transparent                      | `button.primary.label.enabled`  |
| primary    | disabled | transparent                         | `button.primary.border.disabled` | `button.primary.label.disabled` |
| outline    | enabled  | transparent                         | `button.outline.border.enabled`  | `button.outline.label.enabled`  |
| outline    | hover    | `button.outline.background.hover`   | `button.outline.border.enabled`  | `button.outline.label.enabled`  |
| outline    | active   | `button.outline.background.active`  | `button.outline.border.enabled`  | `button.outline.label.enabled`  |
| outline    | disabled | transparent                         | `button.outline.border.disabled` | `button.outline.label.disabled` |
| flat       | enabled  | transparent                         | transparent                      | `button.flat.label.enabled`     |
| flat       | hover    | `button.flat.background.hover`      | transparent                      | `button.flat.label.enabled`     |
| flat       | active   | `button.flat.background.active`     | transparent                      | `button.flat.label.enabled`     |
| flat       | disabled | transparent                         | transparent                      | `button.flat.label.disabled`    |

Focus-visible добавляет ring `focus.ring.default`, не отдельную заливку. Loading включает нативный disabled, поэтому внешнее оформление берётся из disabled-строки appearance, а контент заменяется Spinner. Размеры, padding, gap и radius во всех строках определяются size/common maps из раздела 3, не меняются от state.

## 6) Hard Constraints и открытые вопросы

Подтверждённые ограничения текущего кода: три appearance, три size, нативные состояния; loading блокирует кнопку и заменяет контент; новый публичный вариант не вводится без источника и согласования. Для primary disabled нет заливки, для outline/flat enabled фон прозрачный.

Неизменяемые геометрические требования актуального master, допустимые изменения через примитивы/темы, визуальное соответствие всех размеров, полнота accessible name при loading и touch target для компактных размеров требуют отдельной проверки. Это вопросы к последующей работе, не подтверждённые этим этапом дефекты и не основания менять реализацию сейчас.

## 7) Verification

- Сверены исходники API, exports, style maps, stories, ThemeCheck и двух существующих unit-тестов: рендер текста и busy/Spinner при loading. Наличие тестов не подтверждает остальные сценарии и не означает новый прогон.
- Добавлен Default без принудительных состояний, с существующими controls. Primary/Outline/Flat и их story ID сохранены. Описание компонента охватывает все appearance.
- Технические результаты текущей правки фиксируются ниже после проверки; визуальное/browser review, измерения Figma, новая публикация Code Connect и приёмка владельца не выполнялись.
- Полная документация всех сочетаний состояний по appearance остаётся отдельным пробелом: текущие stories и ThemeCheck не объявляются исчерпывающей матрицей. Это не повод добавлять все сочетания в тесты без оценки риска.

Результаты текущей проверки документации: Prettier --check и typecheck — PASS; локальные ссылки и конкретные цветовые пути обеих тем — PASS. Unit-тесты и сборка Storybook не запускались. Проверка TypeScript подтверждает компиляцию Default story, но не её поведение в браузере.
