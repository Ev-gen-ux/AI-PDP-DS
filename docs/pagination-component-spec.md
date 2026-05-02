# Component Spec: Pagination

## Component Kickoff

| Field             | Value                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Component**     | Pagination                                                                                                                            |
| **Figma node**    | `3358:23472` — [AI-PDP-DS](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3358-23472)                          |
| **States**        | enabled, hover, active, focus-visible, disabled (nav + page cells); current page (active background on page cell)                     |
| **Stories**       | Default (interactive), ManyPages (ellipsis), Disabled                                                                                 |
| **A11y**          | `<nav>` with default `aria-label="Pagination"`; page buttons `type="button"`; `:focus-visible` ring; disabled mirrors `disabled` prop |
| **Done criteria** | Token-first styles; ButtonIcon (secondary, small) for first/last; tests; ThemeCheck; Code Connect; exports in `src/index.ts`          |

## Variant Matrix

| Axis         | Values                                                                           |
| ------------ | -------------------------------------------------------------------------------- |
| Layout       | row: prev (double caret) · page cells / ellipsis · next (double caret)           |
| Nav controls | `ButtonIcon` secondary, small, glyphs `caret-double-left` / `caret-double-right` |
| Page cell    | primary icon-button tokens; current uses `background.active`                     |
| `disabled`   | all controls non-interactive, nav buttons use ButtonIcon disabled styling        |

## Numeric Map (Figma → token)

| Property              | Figma          | Token                                                           | Resolved        |
| --------------------- | -------------- | --------------------------------------------------------------- | --------------- |
| Row height (nav)      | 32px           | `theme.spacing.height.small`                                    | per theme       |
| Gap between items     | 4px            | `theme.spacing.inner.close`                                     | per theme       |
| Page cell min width   | 32px           | `theme.spacing.height.small`                                    | per theme       |
| Border radius (cells) | 8px            | `theme.borderRadius.componentBase`                              | per theme       |
| Typography            | component base | `fontSize` / `lineHeight` component.base, `fontWeight.semiBold` | responsive vars |

## State Token Matrix (page cell, non-current)

| State         | background                                | border      | label                                |
| ------------- | ----------------------------------------- | ----------- | ------------------------------------ |
| enabled       | `button.icon.primary.background.enabled`  | transparent | `button.icon.primary.label.enabled`  |
| hover         | `button.icon.primary.background.hover`    | transparent | `button.icon.primary.label.hover`    |
| active        | `button.icon.primary.background.active`   | transparent | `button.icon.primary.label.active`   |
| focus-visible | (hover/active stack)                      | —           | ring `focus.ring.default`            |
| disabled      | `button.icon.primary.background.disabled` | transparent | `button.icon.primary.label.disabled` |

**Current page:** background `button.icon.primary.background.active`, label `button.icon.primary.label.active`.

## Hard Constraints

- First/last navigation only via design-system `ButtonIcon` (not raw icon).
- No literal spacing/colors; use theme tokens only.
- `pageCount < 1` → render `null`; current page clamped to `[1, pageCount]`.
- Ellipsis is non-interactive text, not a button.

## Verification

- [x] Interactive Default story; demo stories for many pages and disabled.
- [x] `buildPaginationItems` covered by unit tests; Pagination smoke + a11y roles.
- [x] ThemeCheck: short list, ellipsis list, disabled.
- [x] `Pagination.figma.tsx` node `3358:23472`.
- [ ] Pre-merge: `npm run typecheck`, `lint`, `test`, `format:check`; optional `figma:publish` per CI.
