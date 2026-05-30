import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HomePage from './components/HomePage.vue'
import BlogIndex from './components/BlogIndex.vue'
import BlogByline from './components/BlogByline.vue'
import ReleaseDownloader from './components/ReleaseDownloader.vue'
import OntologyBrowser from './components/OntologyBrowser.vue'
import RelationshipTypes from './components/RelationshipTypes.vue'
import YamlSchemas from './components/YamlSchemas.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('BlogIndex', BlogIndex)
    app.component('BlogByline', BlogByline)
    app.component('ReleaseDownloader', ReleaseDownloader)
    app.component('OntologyBrowser', OntologyBrowser)
    app.component('RelationshipTypes', RelationshipTypes)
    app.component('YamlSchemas', YamlSchemas)
  }
}
