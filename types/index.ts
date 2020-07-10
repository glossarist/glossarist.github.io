export interface Post {
  body: string
  id: number
  title: string
}


export interface DocPage {
  id: string

  data?: {
    type?: 'widget' | 'module' | 'panel'
    title: string

    excerpt?: string // Super short
    // TODO: Rename “excerpt” to “in-app tooltip”?

    summary?: string // Longer than excerpt, AsciiDoc
    contents?: string // AsciiDoc
    media?: string[]
  }

  items?: DocsPageItem[]
}


export interface DocsPageNavItem {
  id: string
  importance?: number
  hasContents: boolean
  path: string
  title?: string
  items?: DocsPageNavItem[]
}


export interface DocsPageItem extends DocsPageNavItem {
  excerpt?: string
  summary?: string
  media?: string[]
}
