import fs from 'fs';
import path from 'path';


export default pluginOptions => ({
  afterExport: async state => {
    const appDocsOutPrefix = 'dist/_in_app_help/';
    const appDocsURLPrefix = 'docs/desktop/ui/';

    for (const r of state.routes) {

      // In-app docs
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
    return state;
  },
});
