# 5 — Add slug to Project interface, kill ternary chain

**Problem:** `softwareNavItems` in `projects.ts` has a hardcoded ternary chain:
```ts
p.name === 'concept-browser' ? 'concept-browser' : p.name === 'glossarist-desktop' ? 'desktop' : p.name
```
Adding a new project requires editing this chain. Violates Open/Closed.

**Action:**
- Add `slug: string` to `Project` interface
- Each project defines its own slug
- `softwareNavItems` uses `p.slug`

**Files touched:**
- `.vitepress/data/projects.ts`

**Done when:** `softwareNavItems` has no conditional logic.
