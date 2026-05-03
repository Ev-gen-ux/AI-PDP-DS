---
'@ev-gen-ux/ai-pdp-ds': major
---

Add `Toggle` (switch control) with `Label` and `InlineMessage`, semantic tokens `colors.toggle` / `spacing.toggle.trackWidth` (Figma naming), Code Connect node `3415:32200`. **Breaking:** replaces the previously added `Switcher` export and `colors.switcher` / `spacing.switcher` tokens — migrate imports to `Toggle` / `ToggleProps` / `ToggleState` and theme keys `toggle`.
