# ADR 0001: Use Astro, not VitePress

## Status

Accepted (2026-07-15)

## Context

The site was originally VitePress. The migration was driven by:

- **Vue 3 island hydration** — VitePress doesn't support per-component hydration strategies; Astro's `client:load`, `client:idle`, `client:visible` directives let us hydrate only what needs interactivity.
- **Content collections with typed schemas** — Astro's `defineCollection` + Zod schemas validate frontmatter at build time. VitePress's loose file-based convention couldn't enforce this.
- **Per-page layout flexibility** — Astro layouts are explicit; VitePress themes are global.
- **MDX support** — Astro integrates `@astrojs/mdx`; VitePress's MDX story was limited.
- **Static build + interactive islands** — Astro's island architecture gives us the performance of a static site with the interactivity of an SPA where needed.

## Decision

Migrate to Astro 7. Original VitePress files removed; git history retains them for forensic recovery.

## Consequences

**Pros**
- Smaller interactive payloads (islands hydrate selectively)
- Typed content collections catch frontmatter bugs at build
- MDX enables inline component embedding (used by InlineModal-style figures)
- Rich plugin ecosystem (`@astrojs/sitemap`, `@astrojs/rss`, `astro-pagefind`)

**Cons**
- Migration cost (one-time)
- Astro's static-build model means some patterns require client-side workarounds (e.g. language switching via `localStorage`, not server-side Accept-Language routing)

## Alternatives considered

- **Next.js** — heavier; RSC model didn't fit a content site
- **SvelteKit** — would have required rewriting Vue components
- **Stay on VitePress** — accepted the limitations above

## References

- Migration plan in `TODO.astro/` (historical)
- Build pipeline in `package.json` (`npm run build` chains data generation → astro build)
