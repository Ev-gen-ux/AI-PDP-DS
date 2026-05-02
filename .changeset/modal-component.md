---
'@ev-gen-ux/ai-pdp-ds': minor
---

Add `Modal` panel and `ModalDialog` overlay shell (`modal.fade`, backdrop + padding per Figma `modalDialog`), with stories, tests, and ThemeCheck coverage for the panel.

Align the panel with Figma `3301:19639`: `spacing.modal.minWidth` / `minHeight` (560×359), header row `overflow` and non-growing start cluster, heading `font-feature-settings` (`lnum`/`tnum`), default `iconBefore` to match the master component (`iconBefore={false}` to hide).
