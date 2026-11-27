# Component Spec Document

## 1) Component Kickoff

- Component: `SelectButton`
- Figma node/source: `https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3274-14562` (`3274:14562`)
- Stories to create/update: `Components/SelectButton` (`Default`, `SmallStates`, `ExtraSmallStates`), `Foundation/ThemeCheck`
- A11y checks: `type="button"`, `aria-haspopup="listbox"`, `aria-expanded`, `role="listbox"`, `role="option"`, `aria-selected`, disabled behavior
- Done criteria: token-first style maps + single-select behavior (open list, pick one value, render selected label) + tests + figma mapping + exports

---

## 2) Variant Matrix

| Axis         | Values                                            | Notes                             |
| ------------ | ------------------------------------------------- | --------------------------------- |
| size         | `small (32px)`, `extra small (24px)`              | From master variants              |
| state/status | `enabled`, `hover`, `active`, `focus`, `disabled` | From master variants              |
| isDisabled   | `true`, `false`                                   | Figma axis mirrors disabled state |
| caret icon   | `down`, `up`                                      | `up` for active/open state        |
| loading      | n/a                                               | No loading axis in master         |

---

## 3) Numeric Map

| Variant              | Padding (T/R/B/L) | Gap | Radius | Font size | Line height |
| -------------------- | ----------------- | --- | ------ | --------- | ----------- |
| `small (32px)`       | `8 / 12 / 8 / 12` | `8` | `8`    | `12`      | `16`        |
| `extra small (24px)` | `4 / 8 / 4 / 8`   | `4` | `8`    | `12`      | `16`        |
| `focus` effect       | n/a               | n/a | n/a    | n/a       | `0 0 0 2px` |

---

## 4) Figma -> Token Map

| Variant name (Figma)             | Figma raw value | Selected token                                     | Resolved token value                   |
| -------------------------------- | --------------- | -------------------------------------------------- | -------------------------------------- |
| `small (32px)` height            | `32px`          | `theme.spacing.height.small`                       | `32px`                                 |
| `extra small (24px)` height      | `24px`          | `theme.spacing.height.xSmall`                      | `24px`                                 |
| `small` horizontal padding       | `12px`          | `theme.spacing.paddings.compactMedium`             | `12px`                                 |
| `small` vertical padding         | `8px`           | `theme.spacing.paddings.compact`                   | `8px`                                  |
| `extra small` horizontal padding | `8px`           | `theme.spacing.paddings.compact`                   | `8px`                                  |
| `extra small` vertical padding   | `4px`           | `theme.spacing.inner.close`                        | `4px`                                  |
| `small` gap                      | `8px`           | `theme.spacing.inner.related`                      | `8px`                                  |
| `extra small` gap                | `4px`           | `theme.spacing.inner.close`                        | `4px`                                  |
| radius                           | `8px`           | `theme.borderRadius.componentBase`                 | `8px`                                  |
| font size                        | `12px`          | `theme.typography.fontSize.component.extraSmall`   | `12px`                                 |
| line height                      | `16px`          | `theme.typography.lineHeight.component.extraSmall` | `16px`                                 |
| focus ring                       | `#9DC3EA / 2px` | `theme.colors.focus.ring.default`                  | `#9DC3EA` (light), theme value in dark |

---

## 5) State Token Matrix

| appearance | state    | selected | loading | background                               | border                                | label                                | icon                                           | padding  | height   | radius                                 |
| ---------- | -------- | -------- | ------- | ---------------------------------------- | ------------------------------------- | ------------------------------------ | ---------------------------------------------- | -------- | -------- | -------------------------------------- |
| calm       | enabled  | no       | n/a     | `dropdownButton.background.calm.enabled` | transparent                           | `dropdownButton.label.calm.enabled`  | `dropdownButton.caret.calm.enabled`            | size map | size map | `componentBase`                        |
| calm       | hover    | no       | n/a     | `dropdownButton.background.calm.hover`   | transparent                           | `dropdownButton.label.calm.enabled`  | `dropdownButton.caret.calm.enabled`            | size map | size map | `componentBase`                        |
| calm       | active   | yes/open | n/a     | `dropdownButton.background.calm.active`  | transparent                           | `dropdownButton.label.calm.enabled`  | `dropdownButton.caret.calm.enabled` (caret up) | size map | size map | `componentBase`                        |
| calm       | focus    | no       | n/a     | `dropdownButton.background.calm.enabled` | transparent                           | `dropdownButton.label.calm.enabled`  | `dropdownButton.caret.calm.enabled`            | size map | size map | `componentBase` + `focus.ring.default` |
| calm       | disabled | no       | n/a     | transparent                              | `dropdownButton.border.calm.disabled` | `dropdownButton.label.calm.disabled` | `dropdownButton.caret.calm.disabled`           | size map | size map | `componentBase`                        |

---

## 6) Hard Constraints

- Высота по master: small — 32px при текущих токенах, вертикальный HUG (контент 16 + padding 8 + 8); extra small — FIXED 24px. Не заменять HUG small жёсткой высотой без решения об изменении контракта.
- Fill rules by state: enabled/hover/active have fill, disabled has transparent fill + border. В master `strokeAlign=INSIDE`, `strokesIncludedInLayout=false`: обводка не увеличивает высоту/ширину и не сдвигает контент. В коде disabled stroke рисуется отдельным абсолютным `::after`, а не layout-border. Focus ring остаётся внешним box-shadow.
- Padding rules by size:
  - small: `8 12`
  - extra small: `4 8`
- Radius rules: `8px` in both sizes
- Icon rules: caret is always present, `down` except active/open where `up`

---

## 7) Verification

### 7.1 Fidelity checks

- [x] Master state parity (`enabled/hover/active/focus/disabled`)
- [x] Interactive `Default` Story works with open/select behavior
- [x] Icon semantic/source/fallback/size map check
- [ ] Code Connect check (if `.figma.tsx` changed)
- [ ] Pre-Story Visual Parity check against Figma

### 7.2 Engineering checks

- [ ] `npm run format`
- [ ] `npm run format:check`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`

### 7.3 ThemeCheck sync

- [x] Component added in `Foundation/ThemeCheck`

### Геометрия по архитектуре master — 26 ноября 2026

Прочитаны Auto Layout и дочерние слои всех десяти вариантов набора `3274:14562`: small — HORIZONTAL, HUG × HUG, padding 8/12/8/12, gap 8; XS — HUG × FIXED, 24px, padding 4/8/4/8, gap 4. Label и caret имеют высоту 16px. В enabled/hover/active/focus нет stroke; в disabled — INSIDE stroke 1px, исключённый из layout. При тексте master `selectButton` (ширина 75px) внешняя ширина small 123px, XS 111px; это ширина по содержимому, не фиксированная ширина API.

Браузерный замер до исправления подтвердил small 34px во всех пяти состояниях в light: CSS border добавлял 2px сверх label/caret и padding. Ширина без label была 50px вместо 48px (small), 38px вместо 36px (XS). Исправление убирает border из layout и оставляет disabled-обводку поверх внутреннего края; семантические токены, padding, gap, радиусы, типографика и API сохраняются. Полный визуальный паритет, optional leading icon и публикация mapping не входят в эту правку.

Проверка после исправления: headless Chrome, реальный Storybook, пять состояний каждого размера. В обоих theme-контейнерах light/dark высоты составили 32px и 24px; верхние отступы label/caret — 8px и 4px, высота контента — 16px. Ширина без label — 48px и 36px, что соответствует padding + gap + caret. Disabled-обводка 1px и focus ring сохранены. В интерактивном Default проверены настоящий Tab/focus-visible (с учётом CSS transition), hover, открытие списка и выбор Attribute 2; высота осталась 32px. Это подтверждает геометрию и затронутый сценарий, не полную доступность или пиксельную эквивалентность SVG.

Техническая проверка этой CSS-правки выполняется компонентным visual-профилем `quality:report` (format, typecheck, lint, локальные ссылки); unit-тесты не добавляются и не запускаются, поскольку причина и результат проверены реальным layout в браузере. Подготовлен patch changeset; версия пакета и публикация не выполняются. Прежние галочки Verification выше — исторические отметки, текущие доказательства ограничены описанной геометрией и сценарием. Локальные evidence: `component-specs/select-button/history/evidence/select-button-figma-geometry.json`, `component-specs/select-button/history/evidence/select-button-before-geometry.json`, `component-specs/select-button/history/evidence/select-button-after-geometry.json`, `component-specs/select-button/history/evidence/select-button-browser-interaction.json` и технический отчёт `component-specs/select-button/history/quality/visual/`.
