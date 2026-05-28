# 10 - Adoption guide

Create a comprehensive "How to adopt Glossarist" page.

## Why this matters

The current home page has an "Adopt" button that's disabled. This is a gap —
organizations need guidance on how to start using Glossarist.

## Page: `/docs/adopt.md`

### Content outline

1. **What is Glossarist?** — 2-paragraph overview of the ecosystem
2. **Who is it for?** — Standards bodies, terminology committees, organizations managing concept registries
3. **Adoption paths** (choose your own adventure):

   #### Path A: Desktop app (non-technical users)
   - Download Desktop app
   - Point to an existing GitHub-hosted concept registry
   - Start editing concepts immediately
   - Link to getting-started guide

   #### Path B: Ruby gem (developers, CI/CD)
   - Install glossarist gem
   - Load existing datasets or create new ones
   - Integrate with build pipeline (TBX export, validation)
   - Code example

   #### Path C: JS SDK (web developers)
   - Install glossarist npm package
   - Read/write GCR packages programmatically
   - Build custom web frontends
   - Code example

   #### Path D: Vocabulary Browser (publishing)
   - Deploy concept-browser as a static site
   - Configure datasets.yml
   - Publish your terminology to the web
   - Example: geolexica.org

4. **Data format** — Glossarist concept model (V2/V3 YAML), GCR packages
5. **ISO standards compliance** — 10241-1, 704, 30042, 12620, 25964
6. **Migration** — How to migrate from legacy formats (IEV, TBX) using the upgrade CLI
7. **Community** — GitHub org, issues, discussions

## References

- Glossarist Ruby upgrade CLI: `glossarist upgrade`
- Glossarist JS GCR reader
- Concept-browser datasets.yml configuration
