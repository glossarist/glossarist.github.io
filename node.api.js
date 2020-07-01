import fs from 'fs';
import path from 'path';


export default pluginOptions => ({
  afterExport: async state => {
    const outPrefix = 'dist/_in_app_help/';
    const prefix = 'desktop/docs/ui/'

    for (const r of state.routes) {
      if (r.path.indexOf(prefix) === 0) {
        const id = r.path.replace(prefix, '');
        const _data = r.data?.docPage?.data;
        if (!_data || !id || !_data?.excerpt) {
          continue;
        }
        const data = {
          title: _data.title,
          excerpt: _data.excerpt,
          link: `/${r.path}`,
        };
        const dataJSON = JSON.stringify(data);
        fs.mkdirSync(`${outPrefix}${path.dirname(id)}`, { recursive: true });
        fs.writeFileSync(`${outPrefix}${id}.json`, dataJSON);
      }
    }
    return state
  },
})