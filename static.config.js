import path from 'path'

import { Octokit } from '@octokit/rest'
import marked from 'marked'


const repoOwner = 'glossarist'
const repoName = 'glossarist-desktop'

const octokit = new Octokit();

const DOCS_PATH = path.join(__dirname, 'docs');


function convertFirstBlockToHTML(markdown) {
  return marked.parser([marked.lexer(markdown)[0]]);
}


function getAssetData(a) {
  return {
    name: a.name,
    browser_download_url: a.browser_download_url,
  }
}


function getReleaseData(r) {
  return {
    name: r.name,
    assets: r.assets.map(getAssetData),
    body: r.body,
    published_at: r.published_at,
    bodyHTML: r.body ? convertFirstBlockToHTML(r.body) : '',
  };
}


export default {
  siteRoot: 'https://www.glossarist.org',
  entry: path.join(__dirname, 'src', 'index.tsx'),

  getRoutes: async () => {
    return [
      {
        path: 'desktop',
        template: 'src/containers/Desktop',
        getData: async () => {
          let releases;
          try {
            releases = (await octokit.repos.listReleases({ owner: repoOwner, repo: repoName }))?.data || [];
          } catch (e) {
            console.error("Error fetching product releases");
            throw e;
          }
          if (releases.length < 1) {
            console.warn("Fetched zero product releases")
            return { releases: [] };
          }
          return { releases: releases.slice(0, 2).map(getReleaseData) };
        },
      },
    ];
  },
  plugins: [
    'react-static-plugin-typescript',
    'react-static-plugin-styled-components',
    [
      '@riboseinc/react-static-plugin-aperis-doc-pages',
      {
        sourcePath: DOCS_PATH,
        urlPrefix: 'docs',
        template: 'src/containers/DocPage',
      }
    ],
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
    [
      'react-static-plugin-file-watch-reload',
      {
        paths: [`${DOCS_PATH}/**/*`],
      },
    ],
  ],
}
