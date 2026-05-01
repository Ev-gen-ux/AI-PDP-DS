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

- Fixed sizes: only `32px` and `24px`
- Fill rules by state: enabled/hover/active have fill, disabled has transparent fill + border
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
