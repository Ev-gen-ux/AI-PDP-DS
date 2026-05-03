---
'@ev-gen-ux/ai-pdp-ds': minor
---

**InputTel:** fixed **+7** prefix with `colors.inputTel.prefix`, national mask **(999) 999 99 99**, auto-spacing, max 10 national digits; `value` / `onChange` use digits only. Export mask helpers. Dark theme: `inputTel.prefix` tokens.

**InputText / tokens / Label:** semantic color group `inputText` (light/dark) aligned with Figma `inputtext/*`; `InputText` uses `colors.inputText` for the field; `Label` supports optional `colorGroup="inputText"` for label/required tokens.
