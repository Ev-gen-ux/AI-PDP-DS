# Component Spec: Counter

## Component Kickoff

| Field         | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **Component** | Counter                                                                                                |
| **Figma**     | [node `3367:23536`](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3367-23536)  |
| **Stories**   | Default, Primary (матрица значений × размеры), Secondary                                               |
| **A11y**      | Семантика `span`; подпись через нативные атрибуты (`aria-label` и др.) с пробросом из `HTMLAttributes` |
| **Done**      | Токены `counter/*`, размеры из `spacing.counter.minWidth`, ThemeCheck, тесты форматирования            |

## Variant Matrix

| Ось          | Значения                                                                            |
| ------------ | ----------------------------------------------------------------------------------- |
| `appearance` | `primary` (Figma primary: calm bg + loud label), `secondary` (loud bg + calm label) |
| `size`       | `extra small (16px)`, `small (24px)` — строки 1:1 с Figma Size                      |
| Контент      | от `value`: одна цифра, две, `99+`, `999+` → разные min-width / padding             |

## Numeric map (Figma → token)

| Вариант                         | min-height              | min-width / размеры                         | padding                             |
| ------------------------------- | ----------------------- | ------------------------------------------- | ----------------------------------- |
| XS single (primary / secondary) | `height.2xSmall` (16px) | 16×16 (`counter.minWidth.extraSmallSingle`) | 0 (круг при `borderRadius.rounded`) |
| XS double                       | 16px                    | 20px                                        | 0                                   |
| XS 99+                          | 16px                    | 28px                                        | 0                                   |
| XS 999+                         | 16px                    | 38px                                        | 0                                   |
| Small single                    | `height.xSmall` (24px)  | 24×24                                       | 0                                   |
| Small double                    | 24px                    | 28px                                        | 0                                   |
| Small 99+ / 999+                | 24px                    | 38px / 50px                                 | 0, гориз. `inner.xsClosest`         |
| Радиус                          | —                       | `borderRadius.rounded`                      | —                                   |

## State Token Matrix

Интерактивных состояний в мастере нет; только enabled:

| appearance | background                        | label                        |
| ---------- | --------------------------------- | ---------------------------- |
| primary    | `counter.background.calm.enabled` | `counter.label.loud.enabled` |
| secondary  | `counter.background.loud.enabled` | `counter.label.calm.enabled` |

## Hard Constraints

- Только семантические токены; без литералов цветов/размеров в компоненте.
- Имена `size` совпадают с Figma variant strings.
- Отображение: `value > 99` → `99+`, `value > 999` → `999+`.

## Verification

- [x] Default + демо-матрицы по appearance.
- [x] `formatCounterValue` / `counterLayoutBucket` в тестах.
- [x] ThemeCheck: primary xs, primary sm overflow, secondary sm overflow.
- [x] `Counter.figma.tsx` node `3367:23536`.
