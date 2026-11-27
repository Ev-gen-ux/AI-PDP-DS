# Component Spec: Modal

## 1) Component Kickoff

- **Component:** `Modal` (dialog surface: header, body, footer); `ModalDialog` (full-screen shell + fade + padding per Figma `modalDialog`).
- **Figma:** Panel [node `3301:19639`](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3301-19639); shell [node `3309:21489`](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3309-21489).
- **Stories:** Modal — `Default`, `WithLeadingIcon`, `NonClosable`, `BodyOnly`. ModalDialog — `Default`, `LeadingIcon`.
- **A11y:** `role="dialog"`, `aria-modal`, `aria-labelledby` → heading id; close `type="button"` + `aria-label`; `:focus-visible` on close; Escape + `onClose`; Tab cycle within dialog.
- **Done criteria:** token-only styles, tests green, ThemeCheck updated, exported from package root.

## 2) Variant Matrix

| Axis       | Values                        | Notes                                      |
| ---------- | ----------------------------- | ------------------------------------------ |
| appearance | calm (implicit)               | Single calm track from Figma variables.    |
| iconBefore | off / on (`true` → meta icon) | Optional leading icon in header.           |
| closable   | true / false                  | Close control + Escape when `onClose` set. |
| footer     | node / omitted                | Optional footer strip.                     |
| slots      | `beforeTitle`, `afterTitle`   | Optional header slots.                     |

## 3) Numeric Map (Figma master)

| Region | Padding (T/R/B/L) | Gap         | Radius                     | Font size | Line height |
| ------ | ----------------- | ----------- | -------------------------- | --------- | ----------- |
| Header | 16 / 24 / 16 / 24 | 8 (header)  | panel 16 (`containerBase`) | h4 24     | h4 32       |
| Body   | 24 (all sides)    | —           | —                          | —         | —           |
| Footer | 16 / 24 / 16 / 24 | 8 (actions) | —                          | small 14  | small 20    |

## 4) Figma → Token Map

| Figma variable / usage | Raw (px)    | Token / path                                    |
| ---------------------- | ----------- | ----------------------------------------------- |
| Panel max width        | 560         | `spacing.modal.maxWidth` ← `spacers.560`        |
| Panel max height       | 720         | `spacing.modal.maxHeight` ← `spacers.720`       |
| Panel radius           | 16          | `borderRadius.containerBase`                    |
| Header/footer border   | —           | `colors.modal.border.calm.enabled`              |
| Panel background       | —           | `colors.modal.background.calm.enabled`          |
| Header icon            | —           | `colors.modal.icon.calm.enabled`                |
| Close control          | —           | `colors.modal.buttonClose.calm.*`               |
| Heading                | —           | `typography` heading h4 + `text.base`           |
| Modal fade (overlay)   | `#12141666` | `colors.modal.fade.enabled` (Figma `modalFade`) |
| Shell padding (T/H)    | 32 / 48     | `paddings.large`, `paddings.section`            |
| Shadow                 | —           | `effects.overlay.modal`                         |
| Header padding         | 16, 24      | `paddings.default`, `paddings.relaxed`          |
| Body padding           | 24          | `paddings.relaxed`                              |
| Gaps                   | 8           | `inner.related`                                 |

## 5) State Token Matrix

Calm track only; interactive states use pseudo-selectors + focus ring token.

| State   | background | border | label (title) | icon | close      |
| ------- | ---------- | ------ | ------------- | ---- | ---------- |
| enabled | modal bg   | modal  | text.base     | icon | enabled    |
| hover   | —          | —      | —             | —    | hover      |
| focus   | —          | —      | —             | —    | focus ring |

## 6) Hard Constraints

- Panel radius = `containerBase` (16px), not `componentBase`.
- Header/footer separators use the same border token as the outer modal border.
- Close icon size 24px; leading icon 24px (`meta` when `iconBefore={true}`).
- No raw hex / px literals in component styles (only theme tokens).

## 7) Verification

- [x] State parity for close control (enabled/hover/focus).
- [x] Default Story: real focus/hover where applicable (`moveFocusOnMount` default true in component; stories use false for controls).
- [x] Icons from `@/components/icon` (`metaIconGlyph`, `xIconGlyph`), size map 24.
- [x] `Modal.figma.tsx` node id `3301:19639`.
- [x] `npm run format`, `format:check`, `typecheck`, `lint`, `test`.
- [x] ThemeCheck includes Modal + `iconBefore` example.
