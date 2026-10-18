#!/usr/bin/env node
// Refreshes openapi/pi-durable-platform.yaml from the Pi Durable Platform repository.
//
//   npm run sync:openapi                     # from a checkout: $PDP_REPO, or ../golang/pi-durable-platform
//   npm run sync:openapi -- v0.1.0           # from GitHub, at a tag or commit
//
// The docs describe one Pi Durable Platform release. Until v0.1.0 is tagged,
// the copy comes from a checkout of main; once it is, sync from the tag. The
// API reference under /docs/api/reference is generated from this file at
// build time.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const target = new URL('../openapi/pi-durable-platform.yaml', import.meta.url).pathname;
const ref = process.argv[2];

if (ref) {
  const url = `https://raw.githubusercontent.com/ncecere/pi-durable-platform/${encodeURIComponent(ref)}/api/openapi.yaml`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`GET ${url}: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  writeFileSync(target, await res.text());
  console.log(`openapi/pi-durable-platform.yaml <- ${url}`);
} else {
  const repo = process.env.PDP_REPO
    ? resolve(process.env.PDP_REPO)
    : resolve(join(import.meta.dirname, '../../golang/pi-durable-platform'));
  if (!existsSync(join(repo, 'api/openapi.yaml'))) {
    console.error(`api/openapi.yaml not found in ${repo}. Set PDP_REPO, or pass a tag or commit: npm run sync:openapi -- v0.1.0`);
    process.exit(1);
  }
  const source = join(repo, 'api/openapi.yaml');
  // The checkout is only ever read. Say which commit the copy comes from, and
  // warn when it is not a clean release tag: the docs describe a release.
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();
  try {
    const describe = git('describe', '--tags', '--always', '--dirty');
    console.log(`product checkout: ${repo} (${describe})`);
    if (!/^v\d+\.\d+\.\d+$/.test(describe)) {
      console.warn('warning: the checkout is not exactly at a release tag (or has local changes); the copy may not match a release.');
    }
  } catch {
    console.warn(`warning: could not run git in ${repo}`);
  }
  copyFileSync(source, target);
  console.log(`openapi/pi-durable-platform.yaml <- ${source}`);
}
console.log('Review the diff, then rebuild: the API reference is generated from it at build time.');
