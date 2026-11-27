# InputPassword — Component Spec

## 1) Component Kickoff

- Component: InputPassword, React web; только один новый компонент.
- Source: [принятый Figma master](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3628-364), 26 ноября 2026. Figma принят владельцем с оговоркой. В текущем поручении оговорка уточнена: собственная компонентная семантика цветов InputPassword; уточнённые границы исправления описаны в разделе 9.
- High-fidelity get_design_context: set 3628:364 и enabled 3628:365; session 4009e575-84bb-4053-b9fe-f56439bb4060. Реализация следует текущему принятому master.
- Reuse: existing Label and InlineMessage with their default color semantics, plus Icon. No InputPassword color overrides on nested components. InputText имеет фиксированный type=text и clear action, поэтому напрямую не компонуется без изменения существующего API. Остальные компоненты не перерабатывать.
- Stories: Default (интерактивный), Hover, Focus, WithValue, Visible, Invalid, Disabled, Controlled. Foundation/ThemeCheck: hidden/visible, success, invalid, disabled.
- A11y: native password/text input, label, required, disabled; type=button, keyboard toggle, aria-pressed/controls, focus-visible, merged describedby, no submit/clear/value change on reveal.
- Done: engineering checks, browser geometry/themes/keyboard, local mapping parse; публикация не входит в scope. Приёмка Figma не является приёмкой кода.

## 2) Variant Matrix and API

| Axis               | Values                                                           | Mapping                                                                                      |
| ------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| :state             | enabled, hover, focus, value, invalid, disabled                  | native interaction; value maps to success=true with a sample value; invalid/disabled boolean |
| Visibility         | hidden, visible                                                  | visible / defaultVisible; native type=password/text                                          |
| inValid            | false, true                                                      | invalid; exact Figma spelling retained in mapping                                            |
| appearance / size  | one base                                                         | no new public appearance/size axis                                                           |
| content            | label, placeholder, value/defaultValue, helpMessage/errorMessage | native editable value; no hardcoded password or policy                                       |
| icons              | eye / eye-slash                                                  | installed Phosphor bold through existing Icon layer; field base → IconSize 24                |
| loading / selected | not applicable                                                   | absent from master                                                                           |

InputPasswordProps extends native input attributes except size/type/value/defaultValue/onChange. value/defaultValue are strings; onChange is native input event. Defaults: label=Password, placeholder=Enter password, helpMessage=Enter your password, defaultVisible=false; autoComplete=current-password (overridable). visible/onVisibleChange support controlled reveal; defaultVisible supports uncontrolled reveal. success is explicit validation feedback, never inferred from password length. Native readOnly is retained without inventing a separate visual variant. No strength meter, password policy, leading icon or clear action.

## 3) Numeric Map

All 12 variants share the same geometry. Figma field is HUG with 24px content and 16px T/R/B/L padding = 56px. Stroke is inside and excluded from layout.

| Variant | Padding T/R/B/L | Gap | Radius | Font             | Line height | Icon  |
| ------- | --------------- | --- | ------ | ---------------- | ----------- | ----- |
| all     | 16/16/16/16     | 8   | 8      | Inter Regular 16 | 24          | 24×24 |

Root gap 8px. Example width 254px; component fills its parent, no intrinsic width restriction. Stroke: enabled/hover/value 1px; focus/invalid/disabled 2px. Focus outer ring 2px. Root with label and message is 120px at base typography.

## 4) Figma → Token Map

| Source                    | Figma raw                        | Existing token                                                                                             | Resolved base                                       |
| ------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| paddings/default          | 16                               | spacing.paddings.default                                                                                   | 16px                                                |
| inner/related             | 8                                | spacing.inner.related                                                                                      | 8px                                                 |
| paddings/compact          | 8                                | spacing.paddings.compact                                                                                   | 8px                                                 |
| componentBase             | 8                                | borderRadius.componentBase                                                                                 | 8px                                                 |
| component typography      | Inter / 16 / 24 / 400            | typography.fontFamily.component / fontSize.component.base / lineHeight.component.base / fontWeight.regular | CSS variables, base 16/24                           |
| inputPassword body colors | light/dark palette aliases       | colors.inputPassword.\*                                                                                    | 15 body roles; excludes nested components           |
| focus                     | ring spread 2                    | colors.inputPassword.focus.ring                                                                            | same palette.blue.200 as global focus, 2px geometry |
| inlineMessage             | existing component default/error | InlineMessage native semantic tokens                                                                       | no InputPassword override                           |

No new token collection. Owner clarification: each component owns only its own drawn body semantics; nested DS components retain their native variables/properties and are composed without recoloring. Create colors/inputPassword group in Figma and inputPassword group in both local color JSON files, with palette aliases. Include only body background, border, placeholder, value, icon, cursor and focus ring; nested Label/InlineMessage retain their own semantics; equal resolved colors do not justify consuming inputText roles. Existing shared spacing/radius/typography remain shared. The prior inputText disabled-icon addition is historical and is not removed. Theme/CSS are regenerated with the existing generator, never edited manually. Fixed icon and stroke geometry have no dedicated numeric token in source.

## 5) State Token Matrix

Shared for hidden and visible and both color modes; icon identity changes, colors/geometry do not. Prefix T=colors.inputPassword. Padding=spacing.paddings.default, gap=spacing.inner.related, radius=borderRadius.componentBase in every row; field HUG=56 at base typography.

| State           | Background            | Border                        | Label          | Icon            | Text                                       | Stroke |
| --------------- | --------------------- | ----------------------------- | -------------- | --------------- | ------------------------------------------ | ------ |
| enabled         | T.background.enabled  | T.border.enabled              | Label default  | T.icon.enabled  | T.textPlaceholder.enabled                  | 1      |
| hover           | T.background.enabled  | T.border.hover                | Label default  | T.icon.enabled  | T.textPlaceholder.enabled                  | 1      |
| focus           | T.background.enabled  | T.border.focus + T.focus.ring | Label default  | T.icon.enabled  | placeholder/value as applicable            | 2      |
| value (success) | T.background.enabled  | T.border.success              | Label default  | T.icon.enabled  | T.textPlaceholderValue.enabled             | 1      |
| invalid         | T.background.enabled  | T.border.error                | Label default  | T.icon.enabled  | T.textPlaceholderValue.enabled             | 2      |
| disabled        | T.background.disabled | T.border.disabled             | Label disabled | T.icon.disabled | T.textPlaceholder.disabled for placeholder | 2      |

State priority: disabled > invalid > focus-within > hover > success > enabled. Focus ring also remains visible on an invalid focused field and on keyboard focus of the reveal button. Filled text uses T.textPlaceholderValue.enabled; native masking, never a replacement bullet string. Error message replaces helper when invalid and supplied. Empty or missing messages produce no describedby link. Caller aria-describedby is preserved and merged.

## 6) Hard Constraints

- Preserve 16px padding and 56px base field height: inside strokes must not participate in layout.
- Icon 24px at trailing edge; same Phosphor Eye/EyeSlash bold as Figma source, via Icon layer. No SVG copy inside input component.
- Visibility changes input type and toggle state, preserving the original input/value, selection and focus for pointer activation. Keyboard activation leaves focus on the toggle. Disabled blocks both entry and reveal.
- Toggle graphic remains 24×24. Invisible 44×44 hit area centered around graphic fits inside 56px field; no layout inflation.
- Native input handles password-manager autocomplete, form reset and controlled/uncontrolled values. No automatic password validation, clear action or strength rules.
- Real Default interactions; no state prop, forced pseudo styles or synthetic caret in production.
- Existing native accessibility and semantic tokens retained. Source contrast limitations are reported, not fixed by changing unrelated tokens.

## 7) Verification — initial implementation before color correction

### 7.1 Engineering — 26 ноября 2026

- Source revision: cc58d2b175f6e2e61d61e6800d4c4f1b9590de38 + local InputPassword changes; Node 22.23.5. Existing feature branch retained. Fingerprints and command outputs: `component-specs/input-password/history/quality/logic/report.json`; task state `component-specs/input-password/history/tasks/input-password-component/state.json`.
- Component quality logic: format, project typecheck, scoped lint, 5 behavior tests, Spec links — PASS. Tests cover native masking/reveal, caret/value retention, keyboard toggle, no submit/onChange on reveal, controlled modes, merged descriptions/error priority, disabled, typing and form reset.
- Extra lint for Icon additions, mapping, ThemeCheck and exports — PASS, zero warnings.
- Regression: existing Icon (2) and InputText (5) tests — PASS; `component-specs/input-password/history/evidence/input-password-regression.log`. Existing responsive-theme tests (2) — PASS; `component-specs/input-password/history/evidence/input-password-theme.log`.
- `tokens:build` — PASS; only the missing disabled icon role was added, existing token values preserved. Shared inputText users do not consume that new role. Generated theme and CSS were produced by the existing generator.
- Library build — PASS (`component-specs/input-password/history/evidence/input-password-build.log`). Installed package check — PASS: archive/install/types/ESM/CJS/SSR/Vite+CSS (`component-specs/input-password/history/evidence/input-password-package.log`). Additional installed InputPassword export/SSR hidden-visible-error/value/icon24/theme-role check — PASS (`component-specs/input-password/history/evidence/input-password-installed.log`).
- Storybook build — PASS (`component-specs/input-password/history/evidence/input-password-storybook.log`); 9 stories plus docs appear in the built index. Existing large chunk warning remains; this is not a visual test result.
- Previously dirty files: all 31 preserved byte-for-byte against `component-specs/input-password/history/evidence/input-password-before.json`. No component other than InputPassword changed; Icon registry and ThemeCheck only received the necessary additions. Dependencies/lockfile/CI and existing task histories not changed in this task.

### 7.2 Source, mapping and fidelity

- Accepted master states and both visibility modes represented by native input interactions/props. Geometry implemented as 24px content + 16px padding, stroke isolated in an absolute inside pseudo-element. Only shared semantic tokens used; Label and InlineMessage reused.
- Exact source assets: installed Phosphor Eye/EyeSlash bold are the same sources used to create the accepted Figma icon components. Imported through the existing Icon layer, rendered at 24×24; no temporary Figma URLs or flattened assets in production.
- Local parserless template `InputPassword.figma.ts`: exact node 3628:364 and enum spellings/values; hover/focus remain native interactions. `figma:check` — PASS, 2 templates total. This does not confirm remote publication; no publishing performed.
- Pre-story review: source geometry, state/token maps, icon identity and semantics compared with high-fidelity Figma context. Rendered implementation comparison in both themes, actual browser layout/zoom/touch, real pointer/keyboard interaction and assistive-technology review — **not run**. Computer Use did not approve Google Chrome; browser access host was unavailable. No alternative browser-control route used after that rejection.
- `KeyboardAndGeometry` contains browser assertions for 56px height, 16px padding, Inter, keyboard reveal/focus/value preservation; built but not executed. jsdom results do not establish browser geometry or visual parity.
- Existing Figma placeholder colors/contrast are retained; WCAG contrast compliance is not newly certified by this implementation.

### 7.3 ThemeCheck, compatibility and review

- Foundation/ThemeCheck includes hidden/visible, success, invalid and disabled InputPassword examples; existing examples retained. Both CSS theme sources define the missing disabled icon role.
- Additive export/API: minor changeset `add-input-password.md`; no version bump, commit, push, PR or publication.
- Engineering result ready for review with browser verification still outstanding. Figma was accepted by the owner; code has **not** been accepted. Deferred Figma caveat remains outside this implementation, pending a specific follow-up.
- No next scenario or broader environment acceptance started.

## 8) Previous color migration — superseded for nested components by section 9 — 26 ноября 2026

Owner authorized inspection and correction in both Figma and code. Canonical component group: `inputPassword/*` in Figma colors collection; `colors.inputPassword.*` in code; `--colors-inputPassword-*` in CSS. Alias values come from the current Figma palette, not another component semantic group. New component roles must be created before binding nodes and before local source generation.

Scope: color roles and bindings only; no geometry, interaction, variant count or password policy changes. Reuse Label/InlineMessage instances with local overrides in Figma and an additive colorGroup=inputPassword in code; other consumers keep their defaults. Own focus/ring uses the same palette.blue.200 as the global ring; shared focus style remains unchanged for other components.

Discovery also found the previous local disabled icon dark alias was neutral.400 while current Figma uses neutral.500 (#4a5056). The new inputPassword/icon/disabled follows Figma neutral.500; inputText and other components are not recolored.

### Verification of the color correction

- Figma collection `colors`, new group `inputPassword`: 22 variables, 2 modes, all palette aliases with explicit scopes and WEB syntax. Component-specific effect style `inputPassword/focus` keeps the original 2px ring geometry and blue.200 color; shared style unchanged.
- `component-specs/input-password/history/evidence/input-password-colors-figma.json`: exact created IDs, previous bindings and geometry. `component-specs/input-password/history/evidence/input-password-colors-audit.json`: 76 rendered fill/stroke bindings owned by inputPassword, 2 focus effects bound to inputPassword/focus/ring; no unresolved roles and no before/after Figma color differences. All 12 variants remain 254×120 with the same field geometry. Hidden, non-rendering SVG wrapper fills were excluded from visual color coverage.
- Figma review screenshot checked in light and dark after rebinding: layout/content retained. This is Figma validation, not a rendered browser test of React.
- Scoped Figma → local synchronization: exported only the new variables; 18 referenced palette primitives match the repository. Existing source groups, generated CSS declarations and theme object were reconstructed without the new block and match the pre-task SHA-256 hashes. No bulk tokens:pull/push or unrelated source update.
- Local code: all InputPassword colors and caret now use colors.inputPassword; Label and InlineMessage support an additive colorGroup=inputPassword. Default color groups and existing behavior remain unchanged. Own disabled icon dark now follows Figma neutral.500 (#4a5056); previous inputText roles retained as-is.
- Component logic quality on Node22.23.5 — PASS: project typecheck, scoped lint/format, links and 6 tests. Added SSR style regression proves password label, required marker, error/helper, icon and caret use own variables without inputText/shared input message references. Ten existing Label/InlineMessage/InputText regression tests, 2 responsive-theme tests and additional helper lint — PASS.
- Library/package/Storybook build results and final source hashes are recorded in `component-specs/input-password/history/evidence/input-password-colors-result.json`. Minor unreleased InputPassword changeset updated for independent color semantics; mapping node/API unchanged.
- Browser review remains not-run due the previously disclosed unavailable/unapproved browser access. The Figma screenshot, alias/value audits and SSR tests do not replace browser/a11y acceptance. No external library publication, commit, push or PR.
- Current token correction awaits owner review; prior acceptance remains evidence for the initial implementation only. No further scenario started.

## 9) Composition ownership repair — 26 ноября 2026

Owner correction is authoritative: InputPassword composes the existing Label and InlineMessage DS components. Their variable ownership, color properties and masters must not be changed or overridden by InputPassword. Source pages: [Label](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3141-2483), [InlineMessage](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3141-2677). Existing mapped masters 533:34637 and 529:24944 are retained.

Repair: replace affected nested Figma instances with fresh instances of the same DS masters, retaining text/status/visibility/sizing props but inheriting all colors. Restore Label.tsx and InlineMessage.tsx to their exact pre-migration bytes, remove colorGroup=inputPassword at callsites, remove only the seven accidentally created inputPassword label/required/message roles after reference checks. Body colors remain in inputPassword (15 roles). Geometry, state count and password behavior remain unchanged.

Repair validation: Figma now contains 24 native linked Label/InlineMessage instances from the supplied pages, with fills identical to their main components and no InputPassword color override. The same master IDs, text/status and 254×120 variant geometry are preserved; helper visibility links work across all 12 variants. Shared masters were not edited. Seven obsolete variables had no remaining references in the file before removal; 15 body roles remain.

Label.tsx and InlineMessage.tsx restored byte-for-byte to pre-migration sources; InputPassword calls both without any colorGroup override. Updated style regression requires body password roles and native label/required/message roles, and forbids duplicated password label/message roles. Node22 component quality (typecheck, lint, format, links, 6 tests) and 10 existing related tests — PASS. Library and Storybook build evidence: `component-specs/input-password/history/evidence/input-password-composition-build.log` and `component-specs/input-password/history/evidence/input-password-composition-storybook.log`. Figma light/dark screenshot checked. Browser verification remains not-run as previously disclosed.

Current repair result: `component-specs/input-password/history/evidence/input-password-composition-result.json`. Section 8 is the superseded implementation; its statement that nested DS colors belong to InputPassword is rejected by this explicit owner correction. No geometry/API behavior redesign, publication, commit/push/PR.
