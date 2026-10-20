# Pi Durable Platform docs

The user, team, administrator, operator and app-developer documentation for [Pi Durable Platform](https://github.com/ncecere/pi-durable-platform), the self-hosted console and API where teams deploy, test and manage durable agents built with [Pi](https://github.com/earendil-works/pi) and its durable package. It's published at <https://docs.pdp.bitop.dev>; the product's website is <https://pdp.bitop.dev>. Both addresses, the repositories and the release the docs describe are in `lib/site.ts`.

The docs describe **Pi Durable Platform v0.3.0**, released on 2026-10-20; links into the product's repository are pinned at the `v0.3.0` tag (the roadmap links follow `main`). The product repository's own `DESIGN.md` and `docs/releases/` stay the engineering record. Pi Durable Platform is an independent project; nothing here implies an affiliation with Pi or its authors, and the site uses no Pi logos.

A static site: [Fumadocs](https://fumadocs.dev) on Next.js with `output: "export"`, TypeScript and Tailwind CSS v4, served by nginx in a container. Search is Fumadocs' built-in static index, searched in the browser. No tracking, no cookies, no external fonts or CDNs: Inter is self-hosted.

The **API reference** under `/docs/api/reference` is generated at build time from `openapi/pi-durable-platform.yaml`, a copy of the product's `api/openapi.yaml`. The OAuth Connect endpoints (`/oauth/*`, `/.well-known/*`) aren't in that document; they're hand-written MDX in `content/docs/api/`.

## Local development

You need Node 22 and npm.

```sh
npm ci
npm run dev          # http://localhost:3000
```

| Command | Does |
|---|---|
| `npm run dev` | Development server with hot reload. |
| `npm run build` | The static export, in `out/`, followed by `check-names` (below). |
| `npm run check:links` | Checks every internal link and anchor in `out/` (run after a build; the generated API reference is skipped). |
| `npm run typecheck` | TypeScript. |
| `npm start` | Serves `out/` locally. |
| `npm run sync:openapi` | Refreshes `openapi/pi-durable-platform.yaml` from a product checkout (`../golang/pi-durable-platform`, or `$PDP_REPO`), or from GitHub at a tag: `npm run sync:openapi -- v0.3.0`. |
| `npm run brand` | Regenerates `app/brand.css` from the product's theme (below). |
| `npm run logo -- <chosen>` | Copies the logo from `../pdp-assets/logo/<chosen>/` (below). |
| `npm run screenshots` | Imports screenshots (below). |
| `npm run screenshots:check` | Lists screenshot slots that are still placeholders. |

`npm run build` runs `scripts/check-names.mjs` afterwards (npm's `postbuild`). It fails the build if a page loads anything from another origin; names a competing agent platform, durable execution engine or model gateway, or something private (a real deployment's hosts or tooling); names a `bitop.dev` host other than the docs' and the website's; or uses "PDP" bare: in a page title, in a heading 1, or before "Pi Durable Platform" has been written out on that page. The generated API reference quotes the product's OpenAPI document word for word; its one example host is exempted there and nowhere else.

## Layout

```text
lib/site.ts                       the site and product addresses, repositories and the release described
lib/openapi.ts                    the OpenAPI source, tag labels, and per-page pruning of the document
lib/source.tsx                    the docs and the generated API reference as one Fumadocs source
lib/mark.json                     the logo's mark as inline SVG markup (written by scripts/sync-logo.mjs)
app/brand.css                     the brand tokens (--pdp-*) for Tailwind v4, generated; byte-identical with the website's copy
app/global.css                    Tailwind, Fumadocs' and fumadocs-openapi's CSS, Fumadocs' variables mapped onto brand.css
app/(home)/page.tsx               the landing page
app/docs/[[...slug]]/page.tsx     docs pages and generated API reference pages
app/api/search/route.ts           the static search index (exported as /api/search)
app/not-found.tsx                 the 404 page
content/docs/                     the pages, in MDX, one folder per section (meta.json orders them)
openapi/pi-durable-platform.yaml  the product's OpenAPI document; the API reference is generated from it
components/logo.tsx               the logo: the mark (inline SVG from lib/mark.json) beside the name as live text
components/screenshot.tsx         named screenshot slots, with a marked placeholder until an image exists
components/api-page.tsx           the API reference page (no "try it" playground: the docs never call an install)
lib/screenshot-slots.json         the slots and their alt text
lib/screenshots.json              imported screenshots and their sizes (written by the import script)
public/                           favicons, apple-touch-icon, 192/512 icons and og.png, copied from pdp-assets
scripts/                          sync-openapi, brand-css, sync-logo, import-screenshots, check-links, check-names
nginx/                            nginx.conf and the site's server block and security headers
Dockerfile                        builds the export, then serves it with nginx
SCREENSHOTS.md                    the capture list for the screenshot session
```

The sections: **Get started**, **Use agents**, **Teams**, **Administer**, **Operate**, **Build apps**, **API reference** and **Releases**.

## Writing

- Every claim must be true of the Pi Durable Platform release the docs describe. Check it against the product repository (`README.md`, `DESIGN.md`, `docs/releases/`, `CHANGELOG.md`, `.env.example` and `internal/config`, `api/openapi.yaml`, `migrations/`) and, where those are vague or disagree, the code (`internal/`, `runtime/`, `web/src`), before you write it. Use the web app's own words for pages and buttons. Name planned work as planned.
- Lead with "Pi Durable Platform" in titles and first mentions; "PDP" is fine afterwards. `check-names` enforces it.
- Plain, short sentences. Examples are generic: "Example Corp", `example.com`, the platform at `https://agents.example.com`. Name what the product works with (Pi, Kubernetes and Agent Sandbox, PostgreSQL, OpenAI and Anthropic, OIDC); never competing products, real hosts, people or credentials.
- Frontmatter descriptions containing `: ` must be quoted.
- Use Fumadocs' components where they help: `Callout`, `Steps`, `Tabs`, `Cards`, `Files`.
- Each page has an "Edit on GitHub" link to its file in this repository; API reference pages link to `openapi/pi-durable-platform.yaml`.

### API reference

`npm run sync:openapi` copies the product's `api/openapi.yaml` into `openapi/pi-durable-platform.yaml`. Review the diff and rebuild: there is one page per operation, grouped by the operation's first tag (sidebar labels in `lib/openapi.ts`). Once the release is tagged, sync from the tag (`npm run sync:openapi -- v0.3.0`). Work for an unreleased version can sync from the product checkout's `main` on a branch, then sync again from the tag at the release.

### Brand

`app/brand.css` holds the colours, radii, shadows and fonts as `--pdp-*` variables and Tailwind utilities (`bg-brand-surface`, `text-brand-link`, `rounded-card`, `shadow-brand-2`). It is **generated**, not written by hand: `scripts/brand-css.mjs` (the same script as the website's) derives it deterministically from the product's web app: `web/src/components/ui/themes/neutral.css` and `web/src/components/ui/styles/tokens.css`.

```sh
npm run brand              # write app/brand.css from ../golang/pi-durable-platform (or $PRODUCT_DIR)
npm run brand -- --check   # fail if app/brand.css isn't what the sources give
cmp app/brand.css ../pdp-website/app/brand.css
```

The website (`../pdp-website`) has the same file, and **the two copies must stay byte-identical**: change both together, and check with `cmp`. The same goes for `scripts/brand-css.mjs`.

### Logo

The logo is "Wake": a 3 x 3 grid of dots on the family's dark tile, the one in the middle larger and fuchsia. Its source, exports and usage rules are in `../pdp-assets/logo/` (`logo/wake/`, `logo/README.md`). `components/logo.tsx` draws the mark inline from `lib/mark.json` (`mark-small.svg`, 28 px, `aria-hidden`) beside the name as live text, as the website does from its own `lib/mark.json`; change both together.

```sh
npm run logo -- wake
```

rewrites `lib/mark.json` from `wake/mark-small.svg` and `mark.svg`, and copies `favicon.ico`, `favicon.svg`, `png/apple-touch-icon.png`, `png/icon-192.png` and `png/icon-512.png` into `public/` unchanged, and `png/og-card.png` to `public/og.png`. Files the folder lacks are reported and the current ones kept. Rerun it when the logo changes and commit the results. (`npm run logo -- --placeholder` draws neutral stand-in icons from `lib/mark.json`, for a logo that doesn't exist yet.)

### Screenshots

Screenshots come only from a fictional "Example Corp" demo instance, never from a real install. Each image has a named slot in `lib/screenshot-slots.json` (its alt text and file names) and is placed with `<Screenshot slot="…" />`. Until an image is imported, the slot shows a clearly marked placeholder. `SCREENSHOTS.md` lists, per slot, the persona, page, state and what must be visible. None are captured yet.

```sh
SCREENSHOTS_DIR=../pdp-assets/screenshots npm run screenshots
```

converts each available PNG to WebP (at most 1600 px wide) in `public/images/`, and records its width and height in `lib/screenshots.json`. When you import an image, check that its slot's alt text still describes it.

## Container

```sh
docker build -t pdp-docs .
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp:uid=101,gid=101 pdp-docs
```

nginx (Alpine, pinned by digest) runs as user 101 on port 8080, keeps its pid and temp files under `/tmp` (so the root filesystem can be read-only; mount an `emptyDir` at `/tmp` in Kubernetes), answers `/healthz`, sends security headers and a Content Security Policy, gzips text, and caches hashed assets for a year.

## Deploy

Pushes to `main` run `.github/workflows/publish.yaml`: it type-checks, builds (including `check-names`) and link-checks the site, then builds and pushes a multi-arch image (linux/amd64, linux/arm64):

- `ghcr.io/ncecere/pdp-docs:<full commit sha>`
- `ghcr.io/ncecere/pdp-docs:latest`

Pull requests run the checks only. Actions are pinned by commit SHA, and Dependabot opens grouped weekly updates for npm, Actions and the Docker base images.

## Licence

- **Code** (the site's source, scripts and configuration): [MIT](LICENSE).
- **Documentation text and images**: [Creative Commons Attribution 4.0 International](LICENSE-CONTENT) (CC BY 4.0).
- `openapi/pi-durable-platform.yaml` is a copy of Pi Durable Platform's API description, MIT like the rest of Pi Durable Platform.
- Inter is under the SIL Open Font License 1.1.
