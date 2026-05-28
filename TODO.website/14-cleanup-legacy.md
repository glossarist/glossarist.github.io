# 14 - Clean up legacy code and AWS infrastructure

After the VitePress site is live, decommission all legacy infrastructure.

## Steps

1. **Delete React Static source files**
   - `src/` (all React components, containers, pages, theme)
   - `static.config.js`
   - `node.api.js`
   - `tsconfig.json`
   - `styles.d.ts`, `fonts.d.ts`, `images.d.ts`
   - `artifacts/`

2. **Delete legacy CI workflows**
   - `.github/workflows/build.yml` (Node 10 branch builds)
   - `.github/workflows/deploy-master.yml` (AWS S3 deploy)
   - `.github/workflows/deploy-staging.yml` (AWS S3 staging)

3. **Delete `yarn.lock`**
   - Replaced by `package-lock.json` (npm)

4. **AWS decommission**
   - Remove S3 bucket for glossarist.org
   - Remove CloudFront distribution
   - Remove AWS secrets from GitHub repo secrets
   - Re-point DNS from CloudFront to GitHub Pages

5. **DNS migration**
   - Add CNAME record: `www.glossarist.org` → `glossarist.github.io` (or Pages custom domain)
   - Add A records for apex domain if needed
   - Verify SSL certificate provisioning via GitHub Pages

6. **Keep as reference**
   - Keep `docs/` YAML source files temporarily for content verification
   - Delete after confirming all content is migrated to Markdown

## Verification

After migration:
- [ ] All old URLs return 301 redirects or serve equivalent content
- [ ] `/desktop` → `/docs/software/desktop`
- [ ] `/docs/*` → `/docs/*` (same paths)
- [ ] No broken links
- [ ] Lighthouse score ≥ 90
