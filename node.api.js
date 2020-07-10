import fs from 'fs';
import path from 'path';


export default pluginOptions => ({
  afterExport: async state => {
    const appDocsOutPrefix = 'dist/_in_app_help/';
    const appDocsURLPrefix = 'docs/desktop/ui/';

    const docsURLPrefix = 'docs/';
    const docsSrcPrefix = 'docs/';
    const docsOutPrefix = 'dist/docs'

    for (const r of state.routes) {

      if (r.path.indexOf(docsURLPrefix) === 0) {
        const id = r.path.replace(docsURLPrefix, '');
        const _data = r.data?.docPage?.data;
        if (!_data) {
        } else {
          const media = (_data.media || []);
          for (const f of media) {
            fs.copyFileSync(
              `${docsSrcPrefix}/${path.dirname(id)}/${f.filename}`,
              `${docsOutPrefix}/${id}/${f.filename}`);
          }
        }
      }

      if (r.path.indexOf(appDocsURLPrefix) === 0) {
        const id = r.path.replace(appDocsURLPrefix, '');
        const _data = r.data?.docPage?.data;
        if (!_data || !id || !_data?.excerpt) {
        } else {
          const data = {
            title: _data.title,
            excerpt: _data.excerpt,
            link: _data.contents ? `/${r.path}` : undefined,
          };
          const dataJSON = JSON.stringify(data);
          fs.mkdirSync(`${appDocsOutPrefix}${path.dirname(id)}`, { recursive: true });
          fs.writeFileSync(`${appDocsOutPrefix}${id}.json`, dataJSON);
        }
      }

    }
    return state
  },
})
