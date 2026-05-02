# Component Spec: InputDate

## 1) Component Kickoff

- **Component:** InputDate
- **Figma:** [inputDate · node 3358:23415](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3358-23415)
- **Stories:** `Default`, `Hover`, `Focus`, `WithValue`, `Invalid`, `Disabled`
- **A11y:** `label` + `htmlFor`, `aria-invalid`, `aria-describedby` при ошибке/подсказке, кнопка календаря `type="button"` и `aria-label`, `:focus-visible` на кнопке, фокус-обводка поля через токен `focus.ring`
- **Done criteria:** 4 файла компонента, экспорт из `src/index.ts`, ThemeCheck, тесты, changeset minor, зелёные format/typecheck/lint/test

## 2) Variant Matrix

| Axis          | Values                                 | Notes                                        |
| ------------- | -------------------------------------- | -------------------------------------------- |
| state         | enabled, hover, focus, error, disabled | Как у Input: без отдельного `success` в сете |
| value         | empty, filled (`YYYY-MM-DD`)           | Пустой — оверлей placeholder                 |
| invalid       | true / false                           | Бордер error + InlineMessage                 |
| calendar icon | trailing 24×24                         | `calendarBlankIconGlyph`                     |

## 3) Numeric Map

| Часть                    | Figma raw   | Token / rule                                 |
| ------------------------ | ----------- | -------------------------------------------- |
| Column gap (label–field) | 8px         | `theme.spacing.paddings.compact`             |
| Field padding horizontal | 16px        | `theme.spacing.paddings.default`             |
| Gap text–icon            | 8px         | `theme.spacing.inner.related`                |
| Min height field         | (как Input) | `theme.spacing.height.large`                 |
| Radius                   | 8px         | `theme.borderRadius.componentBase`           |
| Icon                     | 24×24       | `Icon` `size={24}`                           |
| Border                   | 1px         | `border-width: 1px` + цвета `input.border.*` |

## 4) Figma → Token Map

| Element        | Figma | Token                                              |
| -------------- | ----- | -------------------------------------------------- |
| Field bg       |       | `colors.input.background.enabled/disabled`         |
| Border default |       | `colors.input.border.enabled`                      |
| Border hover   |       | `colors.input.border.hover`                        |
| Border focus   |       | `colors.input.border.focus` + `focus.ring.default` |
| Border error   |       | `colors.input.border.error`                        |
| Placeholder    |       | `colors.input.textPlaceholder.*`                   |
| Value text     |       | `colors.input.textPlaceholderValue.*`              |
| Icon           |       | `colors.input.icon.*`                              |

## 5) State Token Matrix

| state    | background        | border                          | label                | icon                |
| -------- | ----------------- | ------------------------------- | -------------------- | ------------------- |
| enabled  | input.bg.enabled  | input.border.enabled            | input.label.enabled  | input.icon.enabled  |
| hover    | input.bg.enabled  | input.border.hover              | …                    | …                   |
| focus    | input.bg.enabled  | input.border.focus + focus ring | …                    | …                   |
| error    | input.bg.enabled  | input.border.error              | …                    | …                   |
| disabled | input.bg.disabled | input.border.disabled           | input.label.disabled | input.icon.disabled |

## 6) Hard Constraints

- Один ряд: label, затем поле с нативной датой и иконкой справа.
- Иконка только `CalendarBlank` из слоя `@/components/icon`.
- Нативный индикатор календаря скрыт; открытие через кнопку (`showPicker` при наличии).
- Значение в DOM: `YYYY-MM-DD`; отображение зависит от браузера.
- Без оси `appearance` / `size` вне макета.

## 7) Verification

- [x] Паритет состояний с мастер-сетом (enabled/hover/focus/error/disabled)
- [x] `Default` story с controls без принудительного pseudo-state
- [x] Иконка: Phosphor через `calendarBlankIconGlyph`, размер 24 для поля высоты `large`
- [x] `InputDate.figma.tsx` с `nodeId: 3358:23415`
- [ ] Ручная визуальная сверка в Storybook с Figma (выполняет автор PR)
