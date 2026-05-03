# Component Spec Document · Stepper

## 1) Component Kickoff

- **Component:** `Stepper`
- **Figma node/source:** [stepper · 3415:30346](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-30346)
- **Stories:** `Default`, `HorizontalStates`, `SlotsToggles`, `VerticalFlow`
- **Разметка (мастер):** трек маркера + линии; `<hgroup/>` — заголовок и описание; слот body (`children`); подвал (`footerContent`, кнопки primary/outline `medium`).
- **A11y:** `nav` + `aria-label`; шаги в `ol` / `li`; `aria-current="step"` на `active` и `invalid`; `aria-invalid` при `state === 'invalid'` или `active` + `invalid === true`; маркер `aria-hidden`
- **Done criteria:** токены `colors.stepper.*`, `spacing.stepper.*`; без литералов цветов в компоненте; экспорт, ThemeCheck, тесты, `.figma.tsx`

## 2) Variant Matrix

| Axis        | Values                                                         | Notes                                                                 |
| ----------- | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| orientation | `horizontal`, `vertical`                                       | Мастер `orientation`                                                  |
| step state  | `completed`, `active`, `disabled`, `invalid`                   | Мастер `state`                                                        |
| invalid     | `boolean` (`true` \| `false`)                                  | Мастер `inValid` → проп `invalid` в коде                              |
| paragraph   | `boolean` (опц.; `false` скрывает описание)                    | Мастер `<paragraph>`                                                  |
| body        | `boolean` (по умолч. вкл.; `false` скрывает) + `children`      | Мастер body / slot content                                            |
| footer      | `boolean` (по умолч. вкл.; `false` скрывает) + `footerContent` | Мастер `<footer> actions`                                             |
| text        | `heading`, `description?`                                      | Заголовок: component/base/semibold; описание: component/small/regular |

## 3) Numeric Map (Figma master)

| Element                | Value            | Token / source                                            |
| ---------------------- | ---------------- | --------------------------------------------------------- |
| Маркер                 | 24×24, radius 12 | `spacing.stepper.markerSize`, `borderRadius.sectionInner` |
| Линия                  | толщина 2        | `spacing.stepper.lineThickness`                           |
| Верт. сегмент линии    | высота 22        | `spacing.stepper.connectorVertical` (+ `spacers.22`)      |
| Gap маркер–линия       | 2                | `spacing.inner.closest`                                   |
| Gap колонок шага       | 16               | `spacing.inner.grouped`                                   |
| Gap заголовок–описание | 4                | `spacing.inner.close`                                     |
| Иконка check           | 16               | `Icon` `size={16}`                                        |

## 4) State Token Matrix (маркер + линия после шага)

Визуал маркера: `completed` | `active` | `invalid` | `disabled` — при `state === 'invalid'` или `state === 'active'` с `invalid === true`.

| Визуал маркера | marker fill               | marker border         | number/icon              | connector after step    |
| -------------- | ------------------------- | --------------------- | ------------------------ | ----------------------- |
| completed      | `backgroundMark.enabled`  | —                     | icon `icon.calm.enabled` | `progressLine.enabled`  |
| active         | `backgroundMark.active`   | `border.loud.enabled` | `label.enabled`          | `progressLine.active`   |
| invalid        | `backgroundMark.active`   | `border.loud.error`   | `label.error`            | `progressLine.active`   |
| disabled       | `backgroundMark.disabled` | —                     | `label.disabled`         | `progressLine.disabled` |

Текст: `label.enabled` / `description.enabled` или варианты `*.disabled` для всего шага в `disabled`.

## 5) Hard Constraints

- Маркер всегда круг `sectionInner` на размере `markerSize`.
- Цвета только из `theme.colors.stepper` и типографика из `theme.typography`.
- Линия между шагами скрыта у последнего элемента.

## 6) Verification

- [x] `npm run tokens:build`, `typecheck`, `lint`, `test`, `format:check`
- [x] ThemeCheck: horizontal + vertical
- [ ] Code Connect publish (CI / вручную по политике репозитория)
