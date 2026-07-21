import sharp from "sharp";
import { copyFileSync } from "node:fs";

const input =
  "/Users/kkk/.cursor/projects/Users-kkk-Desktop-barber-go/assets/2026-07-20_11_01_32-edited-free__carve.photos_-1f387b4e-f455-4a1c-a981-8bd518fe25bd.png";
const output = "/Users/kkk/Desktop/barber-go/public/assets/logo-pc-transparent.png";

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function sat(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  return mx === 0 ? 0 : (mx - mn) / mx;
}

function removeEdgeBackground(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const push = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (lum(data[i], data[i + 1], data[i + 2]) <= 40) {
      visited[idx] = 1;
      queue.push(idx);
    }
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length) {
    const idx = queue.pop();
    data[idx * 4 + 3] = 0;
    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0) push(x - 1, y);
    if (x < width - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < height - 1) push(x, y + 1);
  }
}

function removeEnclosedBlack(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const l = lum(r, g, b);
    const s = sat(r, g, b);
    if (l <= 28 || (l <= 42 && s <= 0.08)) {
      data[i + 3] = 0;
    }
  }
}

function defringeFromBlack(data) {
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha === 0 || alpha === 255) continue;
    const a = alpha / 255;
    data[i] = Math.min(255, Math.round(data[i] / a));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] / a));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] / a));
  }
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
removeEdgeBackground(data, info.width, info.height);
removeEnclosedBlack(data);
defringeFromBlack(data);

const processed = sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
});

const trimmed = await processed.trim({ threshold: 1 }).png().toBuffer();

await sharp(trimmed).png({ compressionLevel: 9 }).toFile(output);

await sharp(trimmed)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile("/Users/kkk/Desktop/barber-go/public/favicon.png");

copyFileSync(output, "/Users/kkk/Desktop/barber-go/public/assets/logo-pc.png");

const meta = await sharp(output).metadata();
console.log("Logo saved:", meta.width, "x", meta.height);
