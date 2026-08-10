# TGen — React Native Mobile Template

Config-driven React Native (CLI) template used by the [TGen](https://github.com/SatPaingOo/t-github-generate) app generator.

This repo is a **template**, not a final app. The TGen website creates a new repo from it, pushes an `app.config.json` + logo, and GitHub Actions builds the branded app.

## How it works

1. TGen website creates a new repo from this template (`POST /repos/{owner}/{template}/generate`).
2. It pushes `app.config.json` + `assets/logo.png`.
3. The `build-android.yml` workflow:
   - `generate` job runs `node scripts/generate.mjs` → rewrites native configs, moves the Kotlin package, generates icons — then commits (`[skip ci]` to avoid re-triggering).
   - `android` job builds a release APK (debug-signed, installable) and publishes it as a GitHub Release.

## app.config.json

```json
{
  "schemaVersion": 1,
  "appName": "My App",
  "slug": "my-app",
  "theme": "light",
  "primaryColor": "#3B82F6",
  "logoUrl": "assets/logo.png",
  "supportEmail": "support@example.com",
  "platforms": ["android"],
  "packageName": "com.example.myapp",
  "version": "1.0.0"
}
```

| Field | Required | Rules |
|---|---|---|
| `appName` | yes | sanitized; strips `" ' \` < > ; \` and newlines, max 40 chars |
| `slug` | no | default derived from appName |
| `theme` | no | `light` \| `dark` \| `system` (default `light`) |
| `primaryColor` | yes | `#RGB` or `#RRGGBB` |
| `logoUrl` | no | path in repo; falls back to solid brand-color icon |
| `supportEmail` | no | shown on the home screen |
| `platforms` | no | informational, drives the JS home screen |
| `packageName` | yes | lowercase dot-separated, e.g. `com.example.myapp` |
| `version` | no | semver `x.y.z`; `versionCode` is derived |

> Keep tokens (`{{APP_NAME}}` etc.) in source files — they are replaced by `scripts/generate.mjs`. Never replace tokens in `node_modules` or build outputs.

## Local development

```sh
npm install
npm run generate   # apply app.config.json (optional — CI does this)
npm run android    # run on emulator/device
npm test           # jest
```

## Template maintenance

- Versions are pinned in `package.json` + lockfile — a generated repo is a snapshot; template updates only affect repos created afterwards.
- When adding a new placeholder, add the file to `TOKEN_FILE_PATTERNS` in `scripts/generate.mjs` and re-run the tests.
- iOS is out of MVP scope but tokenized (`Info.plist`, `AppDelegate.swift`) — Android build is the verified path.
