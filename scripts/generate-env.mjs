#!/usr/bin/env node
// Generates Angular environment files from process.env variables.
// Usage: node scripts/generate-env.mjs [prod|dev]
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const modeArg = (process.argv[2] || '').toLowerCase();
const outDir = resolve('src/environments');
mkdirSync(outDir, { recursive: true });

const required = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

const envValues = Object.fromEntries(required.map(k => [k, process.env[k] || '']));
const missing = required.filter(k => !envValues[k]);

// If all required vars are missing AND a pre-existing environment.ts exists, keep user local file (dev convenience)
const environmentTsPath = resolve(outDir, 'environment.ts');
if (missing.length === required.length && existsSync(environmentTsPath)) {
  console.log('[generate-env] No env vars supplied; keeping existing environment files.');
  process.exit(0);
}

if (missing.length) {
  console.warn('[generate-env] Warning: missing env vars:', missing.join(', '));
}

function buildContent(isProd) {
  return `// AUTO-GENERATED. Do not edit directly.\nexport const environment = {\n  production: ${isProd},\n  firebase: {\n    apiKey: '${envValues.FIREBASE_API_KEY}',\n    authDomain: '${envValues.FIREBASE_AUTH_DOMAIN}',\n    databaseURL: '${envValues.FIREBASE_DATABASE_URL}',\n    projectId: '${envValues.FIREBASE_PROJECT_ID}',\n    storageBucket: '${envValues.FIREBASE_STORAGE_BUCKET}',\n    messagingSenderId: '${envValues.FIREBASE_MESSAGING_SENDER_ID}',\n    appId: '${envValues.FIREBASE_APP_ID}'\n  }\n};\n`; }

// Always generate both so Angular fileReplacements work.
writeFileSync(environmentTsPath, buildContent(true), 'utf8');
writeFileSync(resolve(outDir, 'environment.development.ts'), buildContent(false), 'utf8');

// Preserve example file if user had customized placeholders
const examplePath = resolve(outDir, 'environment.example.ts');
if (!existsSync(examplePath)) {
  writeFileSync(examplePath, readFileSync(environmentTsPath, 'utf8').replace('production: true', 'production: false'), 'utf8');
}

console.log('[generate-env] Generated environment.ts & environment.development.ts');