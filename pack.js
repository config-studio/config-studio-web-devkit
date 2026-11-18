const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const manifestPath = path.join(__dirname, 'plugin.json');
if (!fs.existsSync(manifestPath)) {
  console.error('Error: plugin.json not found');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const pluginId = manifest.id || 'web-devkit';
const version = manifest.version || '1.4.0';

const pkgVersioned = path.join(__dirname, `${pluginId}-${version}.cspkg`);
const pkgLatest = path.join(__dirname, `${pluginId}.cspkg`);

// 1. Prepare Staging directory
const dist = path.join(__dirname, 'dist-pkg');
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist);

// Copy package payload files
const filesToPack = ['plugin.json', 'main.js', 'style.css', 'README.md', 'local.json', 'localization.json'];
for (const f of filesToPack) {
  const src = path.join(__dirname, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, f));
  }
}

// Copy locales directory if present
const localesDir = path.join(__dirname, 'locales');
if (fs.existsSync(localesDir) && fs.statSync(localesDir).isDirectory()) {
  const destLocales = path.join(dist, 'locales');
  fs.mkdirSync(destLocales, { recursive: true });
  for (const f of fs.readdirSync(localesDir)) {
    fs.copyFileSync(path.join(localesDir, f), path.join(destLocales, f));
  }
}

// 2. Try packaging via cspkg CLI
let packed = false;
try {
  execSync(`cspkg pack "${dist}" -o "${pkgVersioned}"`, { stdio: 'inherit' });
  packed = true;
} catch (_) {}

// 3. Try packaging via sibling config-studio Go tool
if (!packed) {
  const csDir = path.join(__dirname, '..', 'config-studio');
  if (fs.existsSync(path.join(csDir, 'cmd', 'cspkg'))) {
    try {
      execSync(`go run ./cmd/cspkg pack "${dist}" -o "${pkgVersioned}"`, { cwd: csDir, stdio: 'inherit' });
      packed = true;
    } catch (_) {}
  }
}

// 4. Standalone Fallback using system archiver
if (!packed) {
  console.log('[Pack] Using standalone fallback packager...');
  const tmpZip = path.join(__dirname, 'dist-pkg.zip');
  if (fs.existsSync(tmpZip)) fs.rmSync(tmpZip);

  if (process.platform === 'win32') {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${dist}/*' -DestinationPath '${tmpZip}' -Force"`, { stdio: 'inherit' });
  } else {
    execSync(`cd "${dist}" && zip -q -r "${tmpZip}" .`, { stdio: 'inherit' });
  }

  const manifestBytes = fs.readFileSync(path.join(dist, 'plugin.json'));
  const payloadBytes = fs.readFileSync(tmpZip);
  fs.rmSync(tmpZip);

  const payloadHash = crypto.createHash('sha256').update(payloadBytes).digest();

  // 48-byte binary header
  const header = Buffer.alloc(48);
  header.write('CSPK', 0, 4, 'ascii'); // Magic: CSPK
  header.writeUInt16LE(1, 4);          // FormatVersion = 1
  header.writeUInt16LE(0, 6);          // Flags = 0
  payloadHash.copy(header, 8, 0, 32);  // PayloadSHA256
  header.writeUInt32LE(manifestBytes.length, 40); // ManifestSize
  header.writeUInt32LE(payloadBytes.length, 44);  // PayloadSize

  const cspkgBuffer = Buffer.concat([header, manifestBytes, payloadBytes]);
  fs.writeFileSync(pkgVersioned, cspkgBuffer);
  console.log(`[Pack] Successfully created: ${pkgVersioned}`);
  packed = true;
}

if (fs.existsSync(pkgVersioned)) {
  fs.copyFileSync(pkgVersioned, pkgLatest);
}

// Clean up staging directory
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });

console.log(`✓ Plugin package ready: ${pkgVersioned}`);
