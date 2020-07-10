import path from 'path'
import dirTree from 'directory-tree'
import fs from 'fs'
import yaml from 'js-yaml'
import _asciidoctor from 'asciidoctor'
import probe from 'probe-image-size'


const asciidoctor = _asciidoctor();


const DOCS_PATH = path.join(__dirname, 'docs');


export default {
  siteRoot: 'https://www.glossarist.org',
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getRoutes: async () => {
    const docsDirTree = dirTree(DOCS_PATH, { extensions:/\.yaml$/ });
    const desktopAppDocsNav = await Promise.all(docsDirTree.children.filter(isValid).map(c => getDocsPageItems(c)));
    const desktopAppRoutes = [docsDirTree].map(e => dirEntryToDocsRoute(e, desktopAppDocsNav));

    return [
      {
        path: 'desktop',
        template: 'src/containers/Desktop',
        children: desktopAppRoutes,
      },
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
    template: 'src/containers/DesktopDocPage',
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
      summary: asciidoctor.convert(_data.summary || ''),
      media,
    };

    return {
      docsNav,
      docPage: {
        id: noExt(entry.name),
        items: entry.type !== 'file'
          ? await Promise.all(children.map(c => getDocsPageItems(c)))
          : undefined,
        data,
      },
    };
  };
}


async function getDocsPageItems(e, prefix) {
  const children = (e.children || []).filter(isValid);
  const dataPath = e.type === 'file' ? e.path : `${e.path}/index.yaml`;
  const directoryPath = path.dirname(dataPath);
  const urlPath = path.join(prefix || '', noExt(e.name));
  const data = await yaml.load(fs.readFileSync(dataPath, { encoding: 'utf-8' }));
  const media = await prepareMedia(directoryPath, data.media);

  return {
    id: noExt(e.name),
    path: urlPath,
    importance: data.importance,
    title: data.title || 'NO TITLE',
    hasContents: (data.contents || '').trim() !== '',
    excerpt: data.excerpt,
    summary: asciidoctor.convert(data.summary || ''),
    media,
    items: await Promise.all(children.map(c => getDocsPageItems(c, urlPath))),
  };
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
