import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HomePage from './components/HomePage.vue'
import BlogIndex from './components/BlogIndex.vue'
import BlogByline from './components/BlogByline.vue'
import ReleaseDownloader from './components/ReleaseDownloader.vue'
import OntologyBrowser from './components/OntologyBrowser.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('BlogIndex', BlogIndex)
    app.component('BlogByline', BlogByline)
    app.component('ReleaseDownloader', ReleaseDownloader)
    app.component('OntologyBrowser', OntologyBrowser)
  }
}
