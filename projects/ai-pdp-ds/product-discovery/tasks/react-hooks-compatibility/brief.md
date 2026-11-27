# React Hooks compatibility

Owner authorized sequential dependency PR review and integration. PR119 upgrades eslint-plugin-react-hooks7.1.1. Repair dependency export conflict and set-state-in-effect violation while preserving existing TableCellInlineEdit props, appearance, draft reset, focus, external value updates and Escape behavior. No token/Figma/API changes or package publication.

Checks: project lint; TableCell regression tests; full required CI on current main.
