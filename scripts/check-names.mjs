#!/usr/bin/env node
// Runs after `next build` (npm's postbuild hook) over the static export in out/:
//  1. Fails if a page references another origin for scripts, styles, fonts,
//     images or frames: the site loads nothing from third parties at runtime.
//  2. Fails if the page text names a competing agent platform or durable
//     execution product, or something private: an internal host, a real
//     deployment's address or an operator's tooling. The docs describe
//     Pi Durable Platform on its own terms. What it works with is fine to
//     name: Pi (whose durable package the agents are built with), Kubernetes
//     and Agent Sandbox, PostgreSQL, OpenAI and Anthropic, and the protocols.
//  3. Fails if a bitop.dev address other than the docs' and the website's own
//     appears anywhere in a page.
//  4. Fails if "PDP" is used bare: never in a page title or heading 1, and on
//     each page only after "Pi Durable Platform" has been written out once.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../out/', import.meta.url).pathname;
if (!existsSync(root)) {
  console.error('out/ not found: run `npm run build` first.');
  process.exit(2);
}

// Named competitors: hosted and open-source agent platforms and durable
// execution engines, and model gateways (a sister product's field).
const forbidden = [
  /\bletta\b/i,
  /lang\s*graph/i,
  /lang\s*smith/i,
  /\bcrew\s*ai\b/i,
  /\bautogen\b/i,
  /agent\s*core/i,
  /agent\s+engine/i,
  /\bbedrock\b/i,
  /assistants\s+api/i,
  /temporal\.io|temporal\s+cloud|\btemporal\s+workflows?\b/i,
  /\brestate\.dev\b|\brestate\s+server\b/i,
  /\binngest\b/i,
  /\bdbos\b/i,
  /\bmastra\b/i,
  /lite\s*llm/i,
  /\bopenrouter\b/i,
  /\bportkey\b/i,
  // Private: a real deployment, its cluster and its tooling.
  /bitop-talos/i,
  /\bpangolin\b/i,
  /\bopenbao\b/i,
  /\bauthentik\b/i,
  /\bhomelab\b/i,
  /pi-agent-interface/i,
  /\bpi-d-ui\b/i,
];

// The only bitop.dev hosts a page may name.
const allowedBitopHosts = new Set(['docs.pdp.bitop.dev', 'pdp.bitop.dev']);

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === '_next') continue;
      yield* files(p);
    } else yield p;
  }
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
// Visible text only: drop scripts (the RSC payload repeats the text), styles and tags.
const textOf = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');

const problems = [];
let pages = 0;
for (const file of files(root)) {
  const rel = relative(root, file);
  if (file.endsWith('.css')) {
    const css = readFileSync(file, 'utf8');
    for (const m of css.matchAll(/url\(\s*["']?(https?:)?\/\/[^)]*\)|@import\s+["']?(https?:)?\/\//g)) {
      problems.push(`${rel}: third-party url ${m[0].slice(0, 120)}`);
    }
    continue;
  }
  if (!file.endsWith('.html')) continue;
  pages++;
  const html = readFileSync(file, 'utf8');

  for (const m of html.matchAll(/<(script|link|img|iframe|source|video|audio)\b[^>]*\b(?:src|href|srcset)="(https?:)?\/\/([^"/]+)[^"]*"[^>]*>/g)) {
    const isCanonicalOrAlternate = m[1] === 'link' && /rel="(canonical|alternate)"/.test(m[0]);
    if (!isCanonicalOrAlternate) problems.push(`${rel}: third-party resource ${m[0].slice(0, 120)}`);
  }

  // Every bitop.dev host in the page, text and links alike.
  for (const m of decode(html).matchAll(/\b((?:[a-z0-9-]+\.)*bitop\.dev)\b/gi)) {
    if (!allowedBitopHosts.has(m[1].toLowerCase())) problems.push(`${rel}: bitop.dev host "${m[1]}"`);
  }

  // Generated API reference pages quote the product's OpenAPI document word
  // for word; its one example host, litellm.example.com, is the product's own
  // text, not the docs naming a product. Anywhere else it fails.
  const text = rel.startsWith('docs/api/reference/') ? textOf(html).replaceAll('litellm.example.com', 'models.example.com') : textOf(html);
  for (const re of forbidden) {
    const hit = text.match(re);
    if (hit) problems.push(`${rel}: forbidden name "${hit[0]}"`);
  }

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  if (/\bPDP\b/.test(title)) problems.push(`${rel}: bare "PDP" in the page title "${title}"`);
  for (const m of html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)) {
    if (/\bPDP\b/.test(textOf(m[1]))) problems.push(`${rel}: bare "PDP" in a heading 1`);
  }

  // The page's own content: the article (docs pages) or main (home, 404).
  const body = html.match(/<article\b[\s\S]*<\/article>/)?.[0] ?? html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '';
  const content = textOf(body);
  const firstShort = content.search(/\bPDP\b/);
  const firstLong = content.indexOf('Pi Durable Platform');
  if (firstShort !== -1 && (firstLong === -1 || firstShort < firstLong)) {
    problems.push(`${rel}: "PDP" before "Pi Durable Platform" is written out ("…${content.slice(Math.max(0, firstShort - 40), firstShort + 20)}…")`);
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`\ncheck-names: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`check-names: ${pages} pages; no third-party resources, competitor or private names, other bitop.dev hosts, or bare "PDP".`);
