# Verification

2026-11-27, Node 22.23.5.

- Normal npm ci passed with peer checks enabled.
- All 26 Storybook 8 lock entries use 8.6.19; no other dependency version changed.
- Local manager and preview started at http://127.0.0.1:6006/ without package compatibility warnings. Telemetry disabled for this local verification command.
- GET /index.json: HTTP 200, 249 entries, including 10 InputPassword entries.
- Full developer and ai-pdp-ds CI required before corrective PR merge.

This checks startup and the story index; it does not assign owner visual acceptance or certify every interaction. No Figma write or package publication.

Source snapshot:

```json
[
  {
    "path": "package.json",
    "sha256": "7fc83d9f6bf6ed1a063f33d7ebfea6f2ea115f401fe038ca05ac564e898f4fda"
  },
  {
    "path": "package-lock.json",
    "sha256": "9ffd4a35ee8f8653f3e0a7da275f316ac63c393c75d81667a0f06eb389a1e98c"
  }
]
```
