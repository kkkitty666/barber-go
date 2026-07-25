#!/usr/bin/env node
/**
 * Compress oversized local assets in place (with /tmp backup).
 * Usage: node scripts/optimize-images.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { dirname, extname, join, relative } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BACKUP_ROOT = "/tmp/barber-go-images-backup";

const require = createRequire(import.meta.url);
const sharp = require(join(ROOT, "node_modules/sharp"));

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function backupFile(absPath) {
  const rel = relative(ROOT, absPath);
  const dest = join(BACKUP_ROOT, rel);
  ensureDir(dirname(dest));
  copyFileSync(absPath, dest);
  return dest;
}

async function writeAtomic(path, buffer) {
  const { writeFileSync, renameSync, unlinkSync } = await import("fs");
  const tmp = `${path}.tmp-opt`;
  writeFileSync(tmp, buffer);
  try {
    renameSync(tmp, path);
  } catch {
    unlinkSync(path);
    renameSync(tmp, path);
  }
}

async function optimizePng(absPath, { maxEdge }) {
  const before = statSync(absPath).size;
  backupFile(absPath);

  const image = sharp(absPath, { failOn: "none" });
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const longest = Math.max(width, height);

  let pipeline = image;
  if (longest > maxEdge) {
    pipeline = pipeline.resize({
      width: width >= height ? maxEdge : undefined,
      height: height > width ? maxEdge : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const buffer = await pipeline
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: false,
    })
    .toBuffer();

  await writeAtomic(absPath, buffer);
  const after = statSync(absPath).size;
  return { before, after, width, height };
}

async function optimizeJpeg(absPath, { maxWidth, quality }) {
  const before = statSync(absPath).size;
  backupFile(absPath);

  const image = sharp(absPath, { failOn: "none" });
  const meta = await image.metadata();
  const format = meta.format;
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  let pipeline = image;
  if (width > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Misnamed PNG saved as .jpg — convert to real JPEG
  const buffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  await writeAtomic(absPath, buffer);
  const after = statSync(absPath).size;
  return { before, after, width, height, note: format !== "jpeg" ? `was ${format}` : undefined };
}

function listProductPngs() {
  const dir = join(ROOT, "public/assets/products/white-cosmetics");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => extname(name).toLowerCase() === ".png")
    .map((name) => join(dir, name));
}

async function main() {
  ensureDir(BACKUP_ROOT);
  console.log(`Backup directory: ${BACKUP_ROOT}\n`);

  const results = [];
  let totalBefore = 0;
  let totalAfter = 0;

  async function run(label, absPath, fn) {
    if (!existsSync(absPath)) {
      console.log(`skip (missing): ${label}`);
      return;
    }
    const result = await fn(absPath);
    totalBefore += result.before;
    totalAfter += result.after;
    const saved = result.before - result.after;
    const pct = result.before ? ((saved / result.before) * 100).toFixed(1) : "0.0";
    const note = result.note ? ` (${result.note})` : "";
    console.log(
      `${label}: ${formatBytes(result.before)} → ${formatBytes(result.after)} ` +
        `(${saved >= 0 ? "-" : "+"}${formatBytes(Math.abs(saved))}, ${pct}%)${note}`,
    );
    results.push({ label, ...result });
  }

  await run("logo-pc.png", join(ROOT, "public/assets/logo-pc.png"), (p) =>
    optimizePng(p, { maxEdge: 256 }),
  );
  await run("logo-pc-transparent.png", join(ROOT, "public/assets/logo-pc-transparent.png"), (p) =>
    optimizePng(p, { maxEdge: 256 }),
  );
  await run("hero-poster.jpg", join(ROOT, "public/assets/hero-poster.jpg"), (p) =>
    optimizeJpeg(p, { maxWidth: 1920, quality: 78 }),
  );

  for (const productPath of listProductPngs()) {
    const rel = relative(join(ROOT, "public/assets"), productPath);
    await run(rel, productPath, (p) => optimizePng(p, { maxEdge: 1000 }));
  }

  await run("logo-gold.png", join(ROOT, "public/assets/logo-gold.png"), (p) =>
    optimizePng(p, { maxEdge: 512 }),
  );
  await run("logo-shield.png", join(ROOT, "public/assets/logo-shield.png"), (p) =>
    optimizePng(p, { maxEdge: 512 }),
  );

  const saved = totalBefore - totalAfter;
  console.log(
    `\nTotal: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} ` +
      `(saved ${formatBytes(saved)})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
