#!/usr/bin/env node
/**
 * TGen generate script (React Native template)
 *
 * Reads `app.config.json` (pushed by the TGen website) and rewrites the
 * template so that the next build is branded for that app:
 *
 *   - native configs: app.json, strings.xml, colors.xml, styles.xml,
 *     build.gradle, settings.gradle, Info.plist
 *   - Kotlin package: moves MainActivity/MainApplication into the new
 *     package directory and rewrites their package declarations
 *   - app icons: generates all Android mipmap sizes from assets/logo.png
 *     (or a solid brand-color square if no logo is present)
 *
 * The script is idempotent — safe to run twice.
 *
 * Usage: node scripts/generate.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const log = (msg) => console.log(`[generate] ${msg}`);

/* ------------------------------------------------------------------ */
/* Config                                                             */
/* ------------------------------------------------------------------ */

function loadConfig() {
  const configPath = path.join(root, 'app.config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing app.config.json in ${root}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const ALLOWED_THEMES = ['light', 'dark', 'system'];

function sanitizeAppName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('appName is required and must be a non-empty string');
  }
  // Strip characters that would break XML / Gradle / plist / JS strings
  const cleaned = name
    .replace(/["'`<>;\\\n\r\t]/g, '')
    .trim()
    .slice(0, 40);
  if (!cleaned) {
    throw new Error('appName contains only invalid characters');
  }
  return cleaned;
}

function toJsName(appName) {
  // "My Cool App!" -> "MyCoolApp" (must match a valid JS identifier / Gradle project name)
  const base = appName.replace(/[^a-zA-Z0-9]/g, '');
  if (!base) {
    throw new Error('appName has no usable letters/numbers for the component name');
  }
  const named = base.charAt(0).toUpperCase() + base.slice(1);
  return /^[a-zA-Z]/.test(named) ? named : `App${named}`;
}

function sanitizePackageName(pkg) {
  if (typeof pkg !== 'string' || !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(pkg)) {
    throw new Error(
      `packageName "${pkg}" is invalid — expected e.g. com.example.myapp (lowercase, dot-separated)`,
    );
  }
  return pkg.toLowerCase();
}

function sanitizeColor(color) {
  if (typeof color !== 'string' || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
    throw new Error(`primaryColor "${color}" is invalid — expected #RRGGBB or #RGB`);
  }
  return color.length === 4
    ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toLowerCase()
    : color.toLowerCase();
}

function sanitizeVersion(version) {
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`version "${version}" is invalid — expected semver like 1.0.0`);
  }
  return version;
}

function toVersionCode(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return major * 10000 + minor * 100 + patch;
}

function toThemeParent(theme) {
  switch (theme) {
    case 'dark':
      return 'Theme.AppCompat.NoActionBar';
    case 'light':
      return 'Theme.AppCompat.Light.NoActionBar';
    case 'system':
    default:
      return 'Theme.AppCompat.DayNight.NoActionBar';
  }
}

function resolveConfig(raw) {
  const appName = sanitizeAppName(raw.appName);
  return {
    ...raw,
    appName,
    slug: raw.slug || appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    jsName: toJsName(appName),
    packageName: sanitizePackageName(raw.packageName),
    primaryColor: sanitizeColor(raw.primaryColor || '#3B82F6'),
    secondaryColor: sanitizeColor(raw.secondaryColor || '#64748B'),
    supportEmail: typeof raw.supportEmail === 'string' ? raw.supportEmail : 'support@example.com',
    version: sanitizeVersion(raw.version || '1.0.0'),
    theme: ALLOWED_THEMES.includes(raw.theme) ? raw.theme : 'light',
    versionCode: toVersionCode(raw.version || '1.0.0'),
    themeParent: toThemeParent(raw.theme),
  };
}

/* ------------------------------------------------------------------ */
/* Token replacement                                                  */
/* ------------------------------------------------------------------ */

function tokenMap(cfg) {
  return {
    APP_NAME: cfg.appName,
    APP_NAME_JS: cfg.jsName,
    PACKAGE_NAME: cfg.packageName,
    PRIMARY_COLOR: cfg.primaryColor,
    SECONDARY_COLOR: cfg.secondaryColor,
    VERSION_NAME: cfg.version,
    VERSION_CODE: String(cfg.versionCode),
    SUPPORT_EMAIL: cfg.supportEmail,
    THEME_PARENT: cfg.themeParent,
  };
}

const TOKEN_FILE_PATTERNS = [
  'app.json',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res/values/strings.xml',
  'android/app/src/main/res/values/colors.xml',
  'android/app/src/main/res/values/styles.xml',
  'android/app/build.gradle',
  'android/settings.gradle',
  'ios/**/Info.plist',
];

function listTokenFiles() {
  const files = [];
  for (const pattern of TOKEN_FILE_PATTERNS) {
    if (pattern.includes('**')) {
      const [base, tail] = pattern.split('/**/');
      const baseDir = path.join(root, base);
      if (fs.existsSync(baseDir)) {
        walk(baseDir, (f) => f.endsWith(tail.split('/').pop()) && files.push(f));
      }
    } else {
      const full = path.join(root, pattern);
      if (fs.existsSync(full)) {
        files.push(full);
      }
    }
  }
  return files;
}

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

function applyTokens(files, tokens) {
  const patterns = Object.entries(tokens).map(([key, value]) => [
    new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
    value,
  ]);
  let touched = 0;
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    let content = original;
    for (const [pattern, value] of patterns) {
      content = content.replace(pattern, value);
    }
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      touched++;
      log(`tokens applied -> ${path.relative(root, file)}`);
    }
  }
  return touched;
}

/* ------------------------------------------------------------------ */
/* Kotlin package                                                      */
/* ------------------------------------------------------------------ */

const KOTLIN_SRC = path.join(root, 'android/app/src/main/java');
const OLD_PACKAGE_DIR = 'com/tgenapp';
const KOTLIN_FILES = ['MainActivity.kt', 'MainApplication.kt'];

function moveKotlinPackage(cfg) {
  const newPackageDir = path.join(KOTLIN_SRC, ...cfg.packageName.split('.'));
  const oldPackageDir = path.join(KOTLIN_SRC, OLD_PACKAGE_DIR);
  const sameDir = newPackageDir === oldPackageDir;

  for (const file of KOTLIN_FILES) {
    const oldFile = path.join(oldPackageDir, file);
    if (!fs.existsSync(oldFile)) {
      continue; // already moved
    }
    let content = fs.readFileSync(oldFile, 'utf8');
    content = content.replace(/package\s+[a-zA-Z0-9_.{}]+/, `package ${cfg.packageName}`);
    // MainActivity.getMainComponentName() must match the JS-registered name
    content = content.replace(/\{\{APP_NAME_JS\}\}/g, cfg.jsName);
    fs.mkdirSync(newPackageDir, { recursive: true });
    const newFile = path.join(newPackageDir, file);
    fs.writeFileSync(newFile, content, 'utf8');
    if (!sameDir) {
      fs.rmSync(oldFile, { force: true });
    }
    log(`kotlin package -> ${cfg.packageName}/${file}`);
  }

  // Remove leftover old package dir (only if it is empty and different)
  if (!sameDir && fs.existsSync(oldPackageDir)) {
    const remaining = fs.readdirSync(oldPackageDir);
    if (remaining.length === 0) {
      fs.rmSync(oldPackageDir, { recursive: true });
      log(`removed old package dir ${OLD_PACKAGE_DIR}`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const MIPMAP_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function generateIcons(cfg) {
  const logoPath = path.join(root, cfg.logoUrl || 'assets/logo.png');
  let source;
  if (fs.existsSync(logoPath)) {
    source = logoPath;
  } else {
    log(`logo not found at ${cfg.logoUrl || 'assets/logo.png'} — using solid brand color`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="${cfg.primaryColor}"/></svg>`;
    source = sharp(Buffer.from(svg));
  }

  const resDir = path.join(root, 'android/app/src/main/res');
  for (const [dir, size] of Object.entries(MIPMAP_SIZES)) {
    const outDir = path.join(resDir, dir);
    fs.mkdirSync(outDir, { recursive: true });
    for (const name of ['ic_launcher.png', 'ic_launcher_round.png']) {
      await sharp(source).resize(size, size, { fit: 'cover' }).png().toFile(path.join(outDir, name));
    }
    log(`icons -> ${dir} (${size}px)`);
  }
}

/* ------------------------------------------------------------------ */
/* Autolinking cache-bust                                             */
/* ------------------------------------------------------------------ */

/**
 * The RN Gradle settings plugin caches the autolinking config keyed on the
 * SHA of package.json (among lockfiles) — build.gradle namespace changes
 * alone would NOT invalidate that cache, so the generated entry point would
 * keep the old token. Bumping "tgenVersion" (an npm-ignored field) to the
 * app version forces a fresh autolinking run on the next build.
 */
function bustAutolinkingCache(cfg) {
  const packagePath = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (pkg.tgenVersion === cfg.version) return;
  pkg.tgenVersion = cfg.version;
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  log(`cache-bust: package.json tgenVersion -> ${cfg.version}`);
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  log('reading app.config.json');
  const cfg = resolveConfig(loadConfig());
  log(
    `config: "${cfg.appName}" (${cfg.jsName}) pkg=${cfg.packageName} color=${cfg.primaryColor} theme=${cfg.theme} v${cfg.version}`,
  );

  const tokens = tokenMap(cfg);
  const touched = applyTokens(listTokenFiles(), tokens);
  log(`token files updated: ${touched}`);

  moveKotlinPackage(cfg);
  bustAutolinkingCache(cfg);
  await generateIcons(cfg);

  log('done — template is ready to build');
}

main().catch((err) => {
  console.error(`[generate] FAILED: ${err.message}`);
  process.exit(1);
});
