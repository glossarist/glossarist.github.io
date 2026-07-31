# 13 — Accessibility WCAG 2.1 AA audit

## Status
☐ Not started (large effort)

## Motivation

The site is mostly accessible (semantic HTML, ARIA where needed, keyboard nav, dark mode) but no formal WCAG 2.1 AA audit has been done. Public-sector and standards-body adopters increasingly require WCAG compliance attestations.

## Scope

Run automated + manual audit:

1. **Automated** — axe-core, Lighthouse a11y audit, pa11y
2. **Manual** — keyboard-only navigation test, screen reader test (VoiceOver + NVDA), reduced-motion test, color-contrast test

## Known issues to investigate

- Vue islands may have hydration mismatches that produce different DOM than SSR (rare but possible)
- The 3D relation sphere in concept-browser is not keyboard-navigable (separate from this site, but worth noting)
- SVG diagrams: `<title>` + `<desc>` exist but `<role="img">` may need `aria-labelledby` correctly wired (verify)
- Color contrast: dark mode palette uses CSS variables; verify all text meets 4.5:1 contrast ratio

## Acceptance criteria

- [ ] Lighthouse a11y score ≥ 95 on every page
- [ ] axe-core zero critical violations
- [ ] Keyboard navigation: every interactive element reachable + operable
- [ ] Screen reader: page structure announced correctly (h1 → h2 → h3 hierarchy)
- [ ] Color contrast: 4.5:1 minimum on all text
- [ ] Reduced motion: animations disabled under `prefers-reduced-motion`
- [ ] WCAG 2.1 AA attestation document published

## Effort

Multi-day. Capture as TODO; execute as a dedicated PR or pair of PRs.
