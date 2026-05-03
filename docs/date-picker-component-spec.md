# Component Spec · DatePicker

## 1) Component Kickoff

| Поле          | Значение                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Component** | `DatePicker` — календарная панель (месяц, шапка с навигацией, сетка дней).                                                                                                                                         |
| **Figma**     | Master `State=Today date` [`3378:24452`](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3378-24452), canvas `3378:24328`.                                                                   |
| **Stories**   | `Default` (stateful), `September2025Static` (паритет с макетом).                                                                                                                                                   |
| **A11y**      | `role="application"` на панели, `aria-label` на календаре; шаг месяца — `aria-label` по-русски; сетка `role="grid"` + `gridcell` + `button`; `aria-selected` / `aria-current="date"`; `:focus-visible` на кнопках. |
| **Done**      | Токены `datePicker/*`, тесты, Code Connect node, ThemeCheck, экспорт пакета.                                                                                                                                       |

## 2) Variant Matrix

| Ось    | Значения                                                           |
| ------ | ------------------------------------------------------------------ |
| Тема   | light / dark через `ThemeProvider` + CSS vars                      |
| Локаль | `locale` (название месяца, дни недели, `aria-label` дня)           |
| Неделя | `weekStartsOn`: `0` (вс) / `1` (пн), по умолчанию `1` как в макете |

Отдельные визуальные `appearance` в макете одни (`calm`).

## 3) Numeric Map (Figma → token)

| Элемент            | Figma raw         | Token / правило                                                           |
| ------------------ | ----------------- | ------------------------------------------------------------------------- |
| Панель padding Y/X | 16 / 24 px        | `paddings.default` / `paddings.relaxed`                                   |
| Gap шапка / сетка  | 12 px             | `paddings.compactMedium`                                                  |
| Gap между рядами   | 4 px              | `inner.close`                                                             |
| Ячейка дня         | 32×32 px          | `height.small`                                                            |
| Радиус панели/дня  | 8 px              | `borderRadius.componentBase`                                              |
| Тень панели        | `0 2 6 #1214161F` | `effects.surface.elevated`                                                |
| Типографика дня    | 14 / 20, regular  | `fontSize.component.small`, `lineHeight.text.small`, `fontWeight.regular` |

## 4) Figma → Token map (цвета)

| Семантика                            | Light primitive                               | Dark (согласовано с поверхностями `dropdownList`) |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------- |
| `datePicker.background.calm.enabled` | `palette.base.white`                          | `palette.neutral.800`                             |
| `datePicker.border.calm.enabled`     | `palette.neutral.100`                         | `palette.neutral.600`                             |
| `datePicker.border.calm.active`      | `palette.blue.400`                            | `palette.blue.300`                                |
| `datePicker.label.calm.enabled`      | `palette.neutral.700`                         | `palette.neutral.25`                              |
| `datePicker.label.calm.secondary`    | `palette.neutral.300`                         | `palette.neutral.400`                             |
| `datePicker.label.calm.inverted`     | `palette.neutral.25`                          | `palette.neutral.25`                              |
| `datePicker.label.calm.red`          | `palette.red.400`                             | `palette.red.300`                                 |
| `datePicker.buttonDay.background.*`  | enabled white, hover blue.50, active blue.400 | enabled 800, hover 700, active blue.400           |
| `datePicker.caret.calm.*`            | enabled 700, disabled 300                     | enabled 25, disabled 500                          |

## 5) State Token Matrix (день)

| Состояние  | Фон                           | Текст                 | Обводка                  |
| ---------- | ----------------------------- | --------------------- | ------------------------ |
| Вне месяца | enabled                       | secondary             | — (кнопка `disabled`)    |
| Обычный    | enabled                       | enabled               | прозрачная 1px           |
| Hover      | `buttonDay.background.hover`  | enabled               | прозрачная               |
| Сегодня    | enabled                       | enabled               | `border.calm.active` 1px |
| Выбран     | `buttonDay.background.active` | `label.calm.inverted` | прозрачная               |

## 6) Hard Constraints

- Только семантические токены `datePicker.*` и общие `focus`, `effects.surface.elevated`, типографика/отступы из `theme`.
- Толщина обводки «сегодня»: 1px, токен `datePicker.border.calm.active`.
- Иконки навигации и месяца — только слой `@/components/icon` (`caretLeft`, `caretRight`, `caretDown`), размер 16.

## 7) Verification

- [x] Мастер Figma: выбранный день (заливка), сегодня (обводка), hover дня — покрыты стилями.
- [x] `Default` story с реальным hover/focus (без принудительного state в controls).
- [x] Code Connect `nodeId` `3378:24452`.
- [x] ThemeCheck: сентябрь 2025, выбран 23, сегодня 7.
- [ ] При появлении отдельных тёмных переменных `datePicker/*` в Figma — сверить dark JSON.
