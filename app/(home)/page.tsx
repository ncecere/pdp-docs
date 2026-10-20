import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { BookOpen, Braces, Code2, MessageSquare, Server, ShieldCheck, Tag, Users } from 'lucide-react';
import { PdpWordmark } from '@/components/logo';
import {
  piUrl,
  productReleaseDate,
  productRepo,
  productRoadmapIssuesUrl,
  productRoadmapUrl,
  productSite,
  productVersion,
} from '@/lib/site';

const sections = [
  {
    title: 'Get started',
    href: '/docs/get-started',
    icon: <BookOpen />,
    description:
      'What Pi Durable Platform is, its concepts (teams, templates, agents, threads, runtimes that hibernate, models, MCP servers, roles), a quick tour and a local install.',
  },
  {
    title: 'Use agents',
    href: '/docs/use',
    icon: <MessageSquare />,
    description: 'Chatting with an agent to test it, shared and private threads, your personal workspace, moving an agent, API keys and connected apps.',
  },
  {
    title: 'Teams',
    href: '/docs/teams',
    icon: <Users />,
    description:
      'Deploying agents from the catalog, team templates and review, triage and deep researcher agents, triggers and runs, tool approvals, the team’s own models and MCP servers, service accounts, usage, the audit log and limits.',
  },
  {
    title: 'Administer',
    href: '/docs/administer',
    icon: <ShieldCheck />,
    description:
      'People and teams, template review, the model and MCP catalogs, prices and cost, settings, usage, the audit log and reading a conversation with a reason.',
  },
  {
    title: 'Operate',
    href: '/docs/operate',
    icon: <Server />,
    description:
      'Requirements, Kubernetes and Agent Sandbox launchers, every setting, OIDC, the two databases, network isolation, backups, upgrades, doctor and the security model.',
  },
  {
    title: 'Build apps',
    href: '/docs/build',
    icon: <Code2 />,
    description:
      'Reaching agents from your own app: keys and OAuth Connect, apps with many people, agents by key and safe retries, threads and messages, event streams, agent state, webhooks and callbacks, errors and limits; building a custom agent, and MCP identity tokens for MCP servers.',
  },
  {
    title: 'API reference',
    href: '/docs/api',
    icon: <Braces />,
    description: 'The OAuth and discovery endpoints, and the management API reference generated from its OpenAPI document.',
  },
  {
    title: 'Releases',
    href: '/docs/releases',
    icon: <Tag />,
    description: `What changed in ${productVersion}, from ${productReleaseDate}, what earlier releases brought, and how to upgrade.`,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 md:py-16">
      <div className="flex flex-col gap-4">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
          <PdpWordmark /> {productVersion} documentation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Deploy, test and manage your teams&apos; durable agents.
        </h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          Pi Durable Platform is a self-hosted console and API. Teams deploy agents built with{' '}
          <a className="text-brand-link underline" href={piUrl}>
            Pi
          </a>
          &apos;s durable package from a reviewed template catalog, test them, and reach them from their
          own apps. Each agent keeps its conversations in its own database schema, runs in its own runtime
          while it is used, and hibernates when idle. These docs are for the people who use agents, the
          teams that run them, platform admins, operators and app developers.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/docs/get-started"
            className="rounded-control bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-contrast shadow-brand-1 hover:bg-brand-primary-hover"
          >
            Get started
          </Link>
          <Link
            href="/docs/build"
            className="rounded-control border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium hover:bg-fd-accent"
          >
            Build an app on it
          </Link>
          <a
            href={productRepo}
            className="rounded-control border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium hover:bg-fd-accent"
          >
            Source on GitHub
          </a>
        </div>
      </div>

      <h2 className="sr-only">Sections</h2>
      <Cards className="mt-12">
        {sections.map((s) => (
          <Card key={s.href} title={s.title} href={s.href} icon={s.icon}>
            {s.description}
          </Card>
        ))}
      </Cards>

      <p className="mt-12 text-sm text-fd-muted-foreground">
        Pi Durable Platform is pre-1.0 development software. These docs describe {productVersion}, from{' '}
        {productReleaseDate}: agents that run on their own, with schedules, signed webhooks and their own reminders,
        tool approvals, MCP identity tokens, custom agents built with the runtime library, and the triage and deep
        researcher kinds. What comes next is in the{' '}
        <a className="text-brand-link underline" href={productRoadmapUrl}>
          roadmap
        </a>{' '}
        and its{' '}
        <a className="text-brand-link underline" href={productRoadmapIssuesUrl}>
          issues
        </a>
        . It is an independent project that runs agents built with
        Pi; it is not part of Pi and is not affiliated with Pi&apos;s authors. More about the project is on{' '}
        <a className="text-brand-link underline" href={productSite}>
          its website
        </a>
        ; the engineering notes stay in the{' '}
        <a className="text-brand-link underline" href={productRepo}>
          repository
        </a>
        .
      </p>
    </div>
  );
}
