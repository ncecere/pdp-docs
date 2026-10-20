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

/** The Pi Durable Platform release these docs describe: "Apps at scale". */
export const productVersion = 'v0.3.0';

/** The date that release was published (YYYY-MM-DD, UTC). */
export const productReleaseDate = '2026-10-20';

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
  'ghcr.io/ncecere/pi-durable-platform@sha256:01972d4f8cf6dfa2e79f2834f2643590d2aca43ba705a347aa0d39040d198a36';
export const runtimeImageDigest =
  'ghcr.io/ncecere/pi-durable-platform-runtime@sha256:c4e967f0ff40df422971303e72bddc3f2225876f55029716f4300ca3126da4a5';

/** The release's Helm chart (OCI, signed with cosign keyless signing) and its version. */
export const productChart = 'oci://ghcr.io/ncecere/charts/pi-durable-platform';
export const productChartVersion = productVersion.replace(/^v/, '');

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
