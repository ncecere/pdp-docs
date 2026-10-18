#!/usr/bin/env node
// Copies the Pi Durable Platform logo into the site, or draws placeholder icons.
//
//   npm run logo -- <chosen>      # from ../pdp-assets/logo/<chosen>/ (or $LOGO_DIR)
//   npm run logo -- --placeholder # icons drawn from the neutral placeholder in lib/mark.json
//
// From a logo folder it:
//  - writes lib/mark.json from mark-small.svg (`svg`, drawn by components/logo.tsx)
//    and mark.svg (`svgRegular`), and sets "placeholder": false;
//  - copies favicon.ico and favicon.svg, and png/apple-touch-icon.png,
//    png/icon-192.png and png/icon-512.png, unchanged, into public/;
//  - copies png/og-card.png to public/og.png.
// The folder is expected to follow the family's layout (mark-small.svg,
// mark.svg, favicon.*, png/). Files it lacks are reported, not invented.
//
// With --placeholder (no logo yet) it draws favicon.svg, favicon.ico,
// apple-touch-icon.png, icon-192.png, icon-512.png and og.png from
// lib/mark.json, so the site has working icons until the logo arrives.
// Nothing is fetched from the network. Commit the results.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const here = import.meta.dirname;
const root = join(here, '..');
const pub = join(root, 'public');
const markPath = join(root, 'lib/mark.json');
const arg = process.argv[2];
mkdirSync(pub, { recursive: true });

const inner = (svg) => {
  const m = svg.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/);
  if (!m) throw new Error('not an SVG document');
  const viewBox = m[1].match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 64 64';
  return { viewBox, body: m[2].replace(/>\s+</g, '><').trim() };
};

if (arg === '--placeholder') {
  await drawPlaceholders();
  process.exit(0);
}

const logoRoot = resolve(join(root, '../pdp-assets/logo'));
let dir = process.env.LOGO_DIR ? resolve(process.env.LOGO_DIR) : arg ? join(logoRoot, arg) : undefined;
if (!dir) {
  const choices = existsSync(logoRoot)
    ? readdirSync(logoRoot).filter((n) => statSync(join(logoRoot, n)).isDirectory() && existsSync(join(logoRoot, n, 'mark-small.svg')))
    : [];
  if (choices.length === 1) dir = join(logoRoot, choices[0]);
  else {
    console.error(
      choices.length
        ? `Several logos in ${logoRoot}: ${choices.join(', ')}. Name one: npm run logo -- <chosen>`
        : `No logo folder with a mark-small.svg in ${logoRoot} yet. Keep the placeholder (npm run logo -- --placeholder), or set LOGO_DIR.`,
    );
    process.exit(1);
  }
}
if (!existsSync(join(dir, 'mark-small.svg'))) {
  console.error(`${dir}/mark-small.svg not found.`);
  process.exit(1);
}

const small = inner(readFileSync(join(dir, 'mark-small.svg'), 'utf8'));
const regular = existsSync(join(dir, 'mark.svg')) ? inner(readFileSync(join(dir, 'mark.svg'), 'utf8')) : small;
const previous = JSON.parse(readFileSync(markPath, 'utf8'));
writeFileSync(
  markPath,
  `${JSON.stringify(
    {
      _comment: previous.placeholder
        ? `The Pi Durable Platform mark (inner SVG markup on the 64 grid), from ../pdp-assets/logo/${dir.split('/').pop()}/. \`svg\` is mark-small.svg, the drawing for 20 to 47 px, used by components/logo.tsx (28 px, nav bar); \`svgRegular\` is mark.svg, the drawing for 48 px and up. Written by \`npm run logo -- ${dir.split('/').pop()}\` (scripts/sync-logo.mjs), which also copies the favicons, icons and og-card into public/. If the logo changes, run it again, change the website's copy too, and commit.`
        : previous._comment,
      placeholder: false,
      source: `pdp-assets/logo/${dir.split('/').pop()}`,
      viewBox: small.viewBox,
      svg: small.body,
      svgRegular: regular.body,
    },
    null,
    2,
  )}\n`,
);
console.log(`lib/mark.json <- ${dir}/mark-small.svg and mark.svg`);

const copies = [
  ['favicon.ico', 'favicon.ico'],
  ['favicon.svg', 'favicon.svg'],
  ['png/apple-touch-icon.png', 'apple-touch-icon.png'],
  ['png/icon-192.png', 'icon-192.png'],
  ['png/icon-512.png', 'icon-512.png'],
  ['png/og-card.png', 'og.png'],
];
const missing = [];
for (const [from, to] of copies) {
  const src = join(dir, from);
  if (!existsSync(src)) {
    missing.push(from);
    continue;
  }
  copyFileSync(src, join(pub, to));
  console.log(`public/${to} <- ${src}`);
}
if (missing.length) {
  console.log(`\nNot in the logo folder (the current public/ files are kept): ${missing.join(', ')}`);
}

async function drawPlaceholders() {
  const { default: sharp } = await import('sharp');
  const mark = JSON.parse(readFileSync(markPath, 'utf8'));
  const full = (body, size) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.viewBox}" width="${size}" height="${size}">${body}</svg>`;
  writeFileSync(join(pub, 'favicon.svg'), `${full(mark.svg, 64)}\n`);
  const png = (body, size) => sharp(Buffer.from(full(body, size))).png().toBuffer();
  writeFileSync(join(pub, 'apple-touch-icon.png'), await png(mark.svgRegular, 180));
  writeFileSync(join(pub, 'icon-192.png'), await png(mark.svgRegular, 192));
  writeFileSync(join(pub, 'icon-512.png'), await png(mark.svgRegular, 512));

  // favicon.ico: 16, 32 and 48 px PNGs in an ICO container.
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map((s) => png(mark.svg, s)));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(s, e);
    header.writeUInt8(s, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(images[i].length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += images[i].length;
  });
  writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([header, ...images]));

  // og.png, 1200x630: the mark, the name and "Documentation", in the dark brand colours.
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0d12"/>
  <svg x="96" y="203" width="224" height="224" viewBox="${mark.viewBox}">${mark.svgRegular}</svg>
  <text x="372" y="300" font-family="Inter, Helvetica, Arial, sans-serif" font-size="76" font-weight="600" fill="#eceef2">Pi Durable Platform</text>
  <text x="372" y="384" font-family="Inter, Helvetica, Arial, sans-serif" font-size="40" fill="#9ba3b0">Documentation</text>
</svg>`;
  writeFileSync(join(pub, 'og.png'), await sharp(Buffer.from(og)).png().toBuffer());
  console.log('public/: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png and og.png drawn from the placeholder in lib/mark.json.');
}
