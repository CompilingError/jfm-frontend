import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '..');
const backendRoot = path.resolve(
  process.env.JFM_BACKEND_DIR || path.join(frontendRoot, '..', 'jfm-backend')
);

const backendTargetDir = path.join(backendRoot, 'target');
const resourcesBackendDir = path.join(frontendRoot, 'resources', 'backend');
const resourcesRuntimeDir = path.join(frontendRoot, 'resources', 'runtime');
const resourcesRuntimeBinDir = path.join(resourcesRuntimeDir, 'bin');
const bundledBackendJarPath = path.join(resourcesBackendDir, 'jfm-backend.jar');
const javaExePath = path.join(resourcesRuntimeBinDir, process.platform === 'win32' ? 'java.exe' : 'java');
const ffmpegExePath = path.join(resourcesRuntimeBinDir, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');

function fail(message) {
  console.error(`\n[release:v1] ${message}\n`);
  process.exit(1);
}

function findBackendJar() {
  if (!fs.existsSync(backendTargetDir)) {
    fail(`Backend target folder was not found: ${backendTargetDir}\nRun Maven package in the backend repo first.`);
  }

  const candidates = fs
    .readdirSync(backendTargetDir)
    .filter((fileName) => fileName.endsWith('.jar'))
    .filter((fileName) => !fileName.endsWith('-plain.jar'))
    .filter((fileName) => !fileName.includes('sources'))
    .filter((fileName) => !fileName.includes('javadoc'));

  if (candidates.length === 0) {
    fail(`No backend jar was found in: ${backendTargetDir}\nRun: mvn -DskipTests package`);
  }

  candidates.sort((a, b) => {
    const aTime = fs.statSync(path.join(backendTargetDir, a)).mtimeMs;
    const bTime = fs.statSync(path.join(backendTargetDir, b)).mtimeMs;
    return bTime - aTime;
  });

  return path.join(backendTargetDir, candidates[0]);
}

function copyFfmpegIfPossible() {
  if (fs.existsSync(ffmpegExePath)) {
    return ffmpegExePath;
  }

  try {
    const ffmpegStaticPath = require('ffmpeg-static');

    if (!ffmpegStaticPath || !fs.existsSync(ffmpegStaticPath)) {
      return null;
    }

    fs.copyFileSync(ffmpegStaticPath, ffmpegExePath);

    return ffmpegExePath;
  } catch {
    return null;
  }
}

fs.mkdirSync(resourcesBackendDir, { recursive: true });
fs.mkdirSync(resourcesRuntimeBinDir, { recursive: true });

const backendJarPath = findBackendJar();
fs.copyFileSync(backendJarPath, bundledBackendJarPath);

if (!fs.existsSync(javaExePath)) {
  fail(
    `Bundled Java runtime was not found: ${javaExePath}\n` +
      'Put a Java 21 runtime in frontend/resources/runtime so bin/java.exe exists.'
  );
}

const copiedFfmpegPath = copyFfmpegIfPossible();

console.log('[release:v1] Backend jar copied:');
console.log(`  from: ${backendJarPath}`);
console.log(`  to:   ${bundledBackendJarPath}`);
console.log('[release:v1] Java runtime found:');
console.log(`  ${javaExePath}`);

if (copiedFfmpegPath) {
  console.log('[release:v1] FFmpeg runtime found:');
  console.log(`  ${copiedFfmpegPath}`);
} else {
  console.warn('[release:v1] FFmpeg runtime was not found. Video cover generation will be disabled, but the app can still start.');
}

console.log('[release:v1] Ready to make Windows installer.');
