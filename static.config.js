import path from 'path'
import dirTree from 'directory-tree'
import fs from 'fs'
import yaml from 'js-yaml'
import _asciidoctor from 'asciidoctor'
import probe from 'probe-image-size'

import { Octokit } from '@octokit/rest'
import marked from 'marked'


const repoOwner = 'glossarist'
const repoName = 'glossarist-desktop'

const asciidoctor = _asciidoctor();

class SectionJSONExtractor {
  convert(node, transform) {
    const nodeName = transform || node.getNodeName()
    if (nodeName === 'embedded') {
      return `[\n${node.getContent().replace(/,$/, '')}\n]`
    } else if (nodeName === 'section' && node.getLevel() === 1) {
      return `\n  ${JSON.stringify({
        id: node.getId(),
        title: node.getTitle(),
      })},`
    } else {
      return ''
    }
  }
}

asciidoctor.ConverterFactory.register(new SectionJSONExtractor(), ['sectionJSON'])

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
    const docsDirTree = dirTree(DOCS_PATH, { extensions:/\.yaml$/ });
    const docsNav = await Promise.all(docsDirTree.children.filter(isValid).map(c => getDocsPageItems(c)));
    const docsRoutes = [docsDirTree].map(e => dirEntryToDocsRoute(e, docsNav));

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
      ...docsRoutes,
    ];
  },
  plugins: [
    'react-static-plugin-typescript',
    'react-static-plugin-styled-components',
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


function dirEntryToDocsRoute(entry, nav) {
  const route = {
    path: `${noExt(entry.name).replace(/index$/g, '') || '/'}`,
    children: entry.type !== 'file'
      ? entry.children.filter(isValid).map(c => dirEntryToDocsRoute(c, nav))
      : undefined,
    template: 'src/containers/DocPage',
    getData: getDocsRouteData(entry, nav),
  };
  return route;
}


function getDocsRouteData(entry, docsNav) {
  return async () => {
    const children = (entry.children || []).filter(isValid);
    const dataPath = entry.type === 'file' ? entry.path : `${entry.path}/index.yaml`;
    const _data = await yaml.load(fs.readFileSync(dataPath, { encoding: 'utf-8' }));
    const directoryPath = path.dirname(dataPath);
    const media = await prepareMedia(directoryPath, _data.media);

    const data = {
      ..._data,
      contents: asciidoctor.convert(`:leveloffset: 2\n\n${_data.contents || ''}`),
      sections: JSON.parse(asciidoctor.convert(_data.contents || '', { backend: 'sectionJSON' }) || '[]'),
      summary: asciidoctor.convert(_data.summary || '', { doctype: 'inline' }),
      media,
    };

    return {
      docsNav,
      docPage: {
        id: noExt(entry.name),
        items: entry.type !== 'file'
          ? await Promise.all(children.map(c => getDocsPageItems(c, true)))
          : undefined,
        data,
      },
    };
  };
}


async function getDocsPageItems(e, readContents, prefix) {
  const children = (e.children || []).filter(isValid);
  const dataPath = e.type === 'file' ? e.path : `${e.path}/index.yaml`;
  const directoryPath = path.dirname(dataPath);
  const urlPath = path.join(prefix || '', noExt(e.name));
  const data = await yaml.load(fs.readFileSync(dataPath, { encoding: 'utf-8' }));

  const itemData = {
    id: noExt(e.name),
    path: urlPath,
    importance: data.importance,
    title: data.title || 'NO TITLE',
    hasContents: (data.contents || '').trim() !== '',
    items: await Promise.all(children.map(c => getDocsPageItems(c, readContents, urlPath))),
  }

  if (readContents !== true) {
    return itemData;
  } else {
    return {
      ...itemData,
      excerpt: data.excerpt,
      summary: asciidoctor.convert(data.summary || '', { doctype: 'inline' }),
      media: await prepareMedia(directoryPath, data.media),
    };
  }
}


function noExt(filename) {
  return path.basename(filename, '.yaml')
}


function isValid(entry) {
  return (
    entry.name !== 'index.yaml' &&
    entry.name[0] !== '.' &&
    ((entry.children || []).length > 0 || entry.type === 'file')
  );
}


async function prepareMedia(basePath, filenames) {
  if ((filenames || []).length < 1) {
    return [];
  }

  var media = [];

  for (const fn of filenames) {

    if (path.extname(fn) === '.png') {
      const imagePath = path.join(basePath, fn);
      const stream = fs.createReadStream(imagePath);

      let width, height;
      try {
        const probeResult = await probe(stream);
        width = parseInt(probeResult.width, 10);
        height = parseInt(probeResult.height, 10);
      } catch (e) {
        width = null;
        height = null;
        console.error("Failed to parse media data", basePath, fn, e);
      } finally {
        stream.close();
      }

      if (width !== null && height !== null) {
        media.push({
          filename: fn,
          type: 'image',
          dimensions: { width, height },
        });
      }
    }
  }

  return media;
}
