# Component Spec Document Template

Use this template as the single required artifact for each component task.

---

## 1) Component Kickoff

- Component:
- Figma node/source:
- Stories to create/update:
- A11y checks:
- Done criteria:

---

## 2) Variant Matrix

List all relevant axes and values (appearance, size, state/status, selected, loading, icons, etc.).

| Axis                 | Values | Notes |
| -------------------- | ------ | ----- |
| appearance           |        |       |
| size                 |        |       |
| state/status         |        |       |
| selected             |        |       |
| loading              |        |       |
| iconBefore/iconAfter |        |       |

---

## 3) Numeric Map

For each critical variant, capture exact numeric values from master Figma.

| Variant | Padding (T/R/B/L) | Gap | Radius | Font size | Line height |
| ------- | ----------------- | --- | ------ | --------- | ----------- |
|         |                   |     |        |           |             |

---

## 4) Figma -> Token Map

| Variant name (Figma) | Figma raw value | Selected token | Resolved token value |
| -------------------- | --------------- | -------------- | -------------------- |
|                      |                 |                |                      |

---

## 5) State Token Matrix

Capture token parity across all required combinations.

| appearance | state | selected | loading | background | border | label | icon | padding | height | radius |
| ---------- | ----- | -------- | ------- | ---------- | ------ | ----- | ---- | ------- | ------ | ------ |
|            |       |          |         |            |        |       |      |         |        |        |

---

## 6) Hard Constraints

List immutable constraints from master node (must match exactly).

- Fixed sizes:
- Fill rules by state (e.g. disabled no-fill):
- Padding rules by appearance/size:
- Radius rules:
- Icon rules:

---

## 7) Verification

### 7.1 Fidelity checks

- [ ] Master state parity (`enabled/hover/active/focus/disabled/loading`)
- [ ] Interactive `Default` Story works with real `:hover/:active/:focus-visible`
- [ ] Icon semantic/source/fallback/size map check
- [ ] Code Connect check (if `.figma.tsx` changed)
- [ ] Pre-Story Visual Parity check against Figma

### 7.2 Engineering checks

- [ ] `npm run format`
- [ ] `npm run format:check`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`

### 7.3 ThemeCheck sync

- [ ] Component added/updated in `Foundation/ThemeCheck`
