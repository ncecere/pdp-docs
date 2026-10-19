/*
 * The site's addresses, repositories and the release it describes, in one
 * place so they are easy to change. Everything else imports from here.
 */

/** The published docs. Used for absolute URLs (Open Graph, metadata). */
export const siteUrl = 'https://docs.pdp.bitop.dev';

/** The product's own website. */
export const productSite = 'https://pdp.bitop.dev';

/** The docs' own repository: "Edit on GitHub" links point here. */
export const gitConfig = {
  user: 'ncecere',
  repo: 'pdp-docs',
  branch: 'main',
};

/** The product's repository. */
export const productRepo = 'https://github.com/ncecere/pi-durable-platform';

/** The Pi Durable Platform release these docs describe: a fix release on top of v0.1.1. */
export const productVersion = 'v0.1.2';

/** The date that release was tagged (YYYY-MM-DD). */
export const productReleaseDate = '2026-10-19';

/**
 * Links to files in the product's repository, pinned at the release's tag so
 * they keep showing the files of the release these docs describe.
 */
export const productTree = `${productRepo}/blob/${productVersion}`;

/** The release's page on GitHub. */
export const productReleaseUrl = `${productRepo}/releases/tag/${productVersion}`;

/** The project's roadmap (an order of work, not a schedule) and its issues. */
export const productRoadmapUrl = `${productRepo}/blob/main/docs/roadmap.md`;
export const productRoadmapIssuesUrl = `${productRepo}/issues?q=is%3Aissue+label%3Aroadmap`;

/**
 * The release's two container images (multi-arch, signed with cosign keyless
 * signing): the platform, and the agent runtime it starts for each agent.
 */
export const productImage = `ghcr.io/ncecere/pi-durable-platform:${productVersion}`;
export const runtimeImage = `ghcr.io/ncecere/pi-durable-platform-runtime:${productVersion}`;

/** The release's signed multi-arch image digests: deploy by these. */
export const productImageDigest =
  'ghcr.io/ncecere/pi-durable-platform@sha256:c20916ab720cc5353e17d8ad5d7c12a50fd637b9cbedc1e453f1a99ca6db6deb';
export const runtimeImageDigest =
  'ghcr.io/ncecere/pi-durable-platform-runtime@sha256:7b61a2af7b1c4aafec78ec0c5af4e9ae8e6978c1bfd375d9fea9f0b52e32c983';

/** Pi, whose durable package the agents are built with: a separate project by other people. */
export const piUrl = 'https://github.com/earendil-works/pi';
export const piDurableUrl = 'https://github.com/earendil-works/pi/tree/main/packages/durable';

/** Kubernetes Agent Sandbox, one of the launchers' backends. */
export const agentSandboxUrl = 'https://agent-sandbox.sigs.k8s.io';

export const appName = 'Pi Durable Platform docs';
export const docsRoute = '/docs';

export const docsRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function editUrl(path: string): string {
  return `${docsRepoUrl}/blob/${gitConfig.branch}/${path}`;
}
