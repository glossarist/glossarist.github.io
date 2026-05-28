# 02 - Create deployment workflow

Replace the 3 legacy GHA workflows (deploy-master, deploy-staging, build) with a single
VitePress → GitHub Pages workflow. Pattern from lutaml.github.io.

## Current problem

- 3 separate workflow files using Node 10/12, actions@v1
- Deploys to AWS S3 + CloudFront (requires AWS secrets)
- No GitHub Pages

## Target

Single `deploy.yml`:
- Triggers on push to main, PRs, workflow_dispatch
- Uses Node 24, actions/checkout@v6, actions/setup-node@v6
- `npm ci && npm run build`
- Upload `.vitepress/dist` via upload-pages-artifact@v4
- Deploy via deploy-pages@v4

## Migration notes

- The AWS S3 + CloudFront deployment should be decommissioned once Pages works
- DNS for www.glossarist.org needs to be repointed from CloudFront to GitHub Pages
- If keeping the custom domain, add CNAME file to `public/`
- GitHub Pages must be enabled in repo Settings → Pages → Source: GitHub Actions
