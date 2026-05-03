# @ev-gen-ux/ai-pdp-ds

## 0.13.0

### Minor Changes

- e101ac2: Add `ProgressBar` with `value` / `max` API, semantic tokens `progressBar.background.enabled` and `progressBar.background.active` (light + dark), ThemeCheck coverage, and Code Connect mapping for Figma node `3392:29873`.

  Support `indeterminate` horizontal loading animation (sliding segment on the track).

## 0.12.0

### Minor Changes

- 7f3f51e: Add `InputEmail` with semantic tokens `colors.inputEmail` (light/dark), leading envelope icon glyph `inputEmailLeadingIconGlyph`, stories, tests, ThemeCheck, and public export.

## 0.11.0

### Minor Changes

- fe6fe0a: Add `InputSearch` with semantic tokens `colors.inputSearch` (light/dark), leading magnifying-glass icon glyph, stories, tests, ThemeCheck, and public export.

## 0.10.0

### Minor Changes

- 48b38bc: Add `InputFile` and `FileUpload` with semantic tokens (`colors.inputFile`), Icon glyphs (`uploadSimple`, Figma **FileXls** as `fileXlsIconGlyph`, `trash`), ThemeCheck coverage, and quality-metrics notes for IDE module resolution.

## 0.9.1

### Patch Changes

- 8a562bf: Align light theme `input.background.disabled` with Figma (`neutral/50`, `#efeff0`); was `base.white`. Dark theme unchanged (`neutral/800`). Primitives unchanged — verified via Figma variables on node `128:18497`.

## 0.9.0

### Minor Changes

- 3b7a738: InputDate: custom calendar popover with DatePicker, MonthPicker, and YearPicker; portal + fixed positioning; placeholder hidden while the input is focused; DatePicker month-year header props for the view menu.

## 0.8.0

### Minor Changes

- fa2a133: Add `DatePicker`, `YearPicker`, and `MonthPicker` with shared `datePicker/*` semantic tokens (light/dark): weekend label (`label.calm.red`), selected label (`label.calm.active`), dark-theme token table aligned with Figma. Icon layer exports caret glyphs for navigation. ThemeCheck and component spec; year/month header uses a single `paddings.compactMedium` gap before the divider. Document unified primitive palette policy in `figma-tokens-pull.js` and session notes in `docs/quality-metrics.md`.

## 0.7.0

### Minor Changes

- 3a9605f: Add `Divider` with `appearance` (calm/loud), `orientation` (horizontal/vertical), and semantic tokens `divider.background.*` in light/dark themes.

## 0.6.0

### Minor Changes

- 95440b6: Add `Counter` badge with Figma-aligned sizes and `counter` semantic colors/spacing. Extend primitives (`spacers` 28, 38, 50) and theme spacing `counter.minWidth.*`.

## 0.5.0

### Minor Changes

- 41f92e7: Add `Pagination` with `ButtonIcon` navigation (double caret), page cells from `button.icon.primary` tokens, and `buildPaginationItems` helper. Extend `ButtonIcon` with `caret-double-left` and `caret-double-right` icons.

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
