# AI-PDP-DS — component quality report

SelectButton · visual · 2026-11-26T12:11:58.752Z

Technical checks: PASS; inputs unchanged: true. Acceptance: not-reviewed.

| Check | Result | Why |
| --- | --- | --- |
| format | PASS | Component implementation, examples, tests and Spec |
| typecheck | PASS | Project-wide types: the current typecheck is not file-scoped |
| lint | PASS | Lint the discovered component files without autofix |
| links | PASS | Check local file links in the canonical Spec; anchors and remote URLs are not verified |

## Manual checks — not run

- Source and scope review: Compare Spec/API/stories and the actual diff; declared change type does not detect dependencies automatically
- Behavior and accessibility: Review affected scenarios from Spec; unit PASS is not browser or accessibility acceptance
- Visual and themes: Inspect affected states/themes against the accepted design source in a browser; no screenshots are generated here

## Not run

- Full coverage/tooling/build/package/Storybook/Code Connect pipeline and publication
- Unit tests: visual mode does not assert changed logic; use logic mode as well if needed

## Limits

- Explicit scope only; no automatic import/token impact graph
- Tests in shared folders may exercise more than the named component; no new tests are created
- Shared tokens, dependencies, exports or build changes require broader checks
- Technical checks are not component acceptance or release readiness

No full-suite coverage counts are reused. Commands, input hashes, outputs and failures are in report.json and per-check logs.
