# Component Spec: Divider

## 1) Component Kickoff

| Field         | Value                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Component** | Divider                                                                                                                    |
| **Figma**     | [node `3367:24263`](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3367-24263)                      |
| **Stories**   | Default (controls), CalmAndLoudHorizontal, VerticalInRow                                                                   |
| **A11y**      | `role="separator"`, `aria-orientation` по `orientation`, проброс `HTMLAttributes`                                          |
| **Done**      | Токены `divider/background/*`, толщина `spacing.inner.xsClosest`, ThemeCheck, тесты, Code Connect `nodeId`, экспорт пакета |

## 2) Variant Matrix

| Ось           | Значения                 |
| ------------- | ------------------------ |
| `appearance`  | `calm`, `loud`           |
| `orientation` | `horizontal`, `vertical` |
| Интерактив    | нет (только enabled)     |

## 3) Numeric Map (Figma → token)

| Вариант     | Толщина линии                     | Размеры                                                                               |
| ----------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| Горизонталь | `spacing.inner.xsClosest` (`1px`) | `width: 100%`, высота = толщина                                                       |
| Вертикаль   | `spacing.inner.xsClosest` (`1px`) | `width` = толщина; `min-height: height.xSmall`; в flex-row со `stretch` — высота ряда |

## 4) Figma → Token Map (light, переменные узла)

| Token path (семантика)            | Figma raw | Палитра       |
| --------------------------------- | --------- | ------------- |
| `divider.background.calm.enabled` | `#dee0e2` | `neutral.100` |
| `divider.background.loud.enabled` | `#5c646c` | `neutral.400` |

**Dark:** до появления отдельных переменных в DTCG зафиксированы `neutral.600` (calm) и `neutral.300` (loud) для читаемости на тёмном фоне; при расхождении с Figma — Clarification Gate.

## 5) State Token Matrix

Только enabled:

| appearance | background                        |
| ---------- | --------------------------------- |
| calm       | `divider.background.calm.enabled` |
| loud       | `divider.background.loud.enabled` |

## 6) Hard Constraints

- Цвет только семантические `divider.background.*`; толщина — `inner.xsClosest`.
- Без интерактивных псевдоклассов.
- Вертикаль: `min-height: height.xSmall`; в flex-строке с `align-items: stretch` — полная высота ряда.

## 7) Verification

- [x] Нет hover/focus/disabled в мастере — не фиксируем в controls.
- [x] Default story с controls (`appearance`, `orientation`).
- [x] Демо горизонтали calm/loud и вертикали во flex.
- [x] `Divider.figma.tsx` node `3367:24263`.
- [ ] При появлении тёмных переменных `divider/*` в Figma — сверить dark JSON и обновить матрицу.
