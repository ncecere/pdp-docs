import mark from '@/lib/mark.json';

/*
 * The Pi Durable Platform logo, "Wake": the mark beside the name. The mark is
 * inline SVG (no request, no font) from lib/mark.json, which
 * `npm run logo -- wake` writes from ../pdp-assets/logo/wake/mark-small.svg;
 * the name beside it is live text. The website draws the same mark at the
 * same size from its own copy of lib/mark.json: change both together.
 */

/** The mark: decorative here, because the name is always next to it. */
export function PdpMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg
      viewBox={mark.viewBox}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      // Static markup from lib/mark.json, written by us; no user input.
      dangerouslySetInnerHTML={{ __html: mark.svg }}
    />
  );
}

/** The product's full name as text, set in Inter (used inline in sentences too). */
export function PdpWordmark({ className }: { className?: string }) {
  return <span className={`font-semibold tracking-tight whitespace-nowrap ${className ?? ''}`}>Pi Durable Platform</span>;
}

/**
 * The nav bar title: the mark, the name and a "docs" tag. `antialiased`
 * matches the website, whose body sets it, so the name renders identically.
 */
export function NavTitle() {
  return (
    <span className="inline-flex items-center gap-2.5 text-fd-foreground antialiased">
      <PdpMark />
      <PdpWordmark className="text-[1.05rem]" />
      <span className="rounded-md border border-fd-border px-1.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
        docs
      </span>
    </span>
  );
}
