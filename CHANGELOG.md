# @ev-gen-ux/ai-pdp-ds

## 0.4.0

### Minor Changes

- 314aee9: Add `InputDate` atom: native date field with calendar trigger, label, help/error messages, and `calendarBlankIconGlyph` on the icon layer.
- bd9bcd2: StatusMark: add appearances `error`, `alert`, `information`, `wait` (plus existing `success`); tokens under `colors.statusMark`. Export `StatusMarkAppearance`.

  Accordion: add `appearance` prop (`default` | `calm` | `accent`) with matching accordion tokens. Export `AccordionAppearance`.

## 0.3.0

### Minor Changes

- fe4aa3f: InlineMessage: add `status="success"` and semantic token `input.inlineMessage.success` (light: green.500, dark: green.300), aligned with Figma node 529:24944. Tabular number font features match component text in the file.

## 0.2.0

### Minor Changes

- 956db69: Add `Modal` panel and `ModalDialog` overlay shell (`modal.fade`, backdrop + padding per Figma `modalDialog`), with stories, tests, and ThemeCheck coverage for the panel.

  Align the panel with Figma `3301:19639`: `spacing.modal.minWidth` / `minHeight` (560×359), header row `overflow` and non-growing start cluster, heading `font-feature-settings` (`lnum`/`tnum`), default `iconBefore` to match the master component (`iconBefore={false}` to hide).

- 8d842a7: Spinner: align with Figma master (3300-18914), add `spinner.border.calm.enabled` tokens, SVG arc with gradient stroke and rotation animation; extend `SpinnerSize` with 32 and 40.
- e8af726: Add `TabGroup` and `TabItem` components with tab tokens, keyboard navigation, and Storybook coverage.

## 0.1.1

### Patch Changes

- 714a011: Docs: align and strengthen component delivery governance in CLAUDE.md.
  - Added mandatory Type Safety Gate and Versioning Gate.
  - Deduplicated overlapping rules with cross-references to single source sections.
  - Added practical templates for changeset and component release notes.
