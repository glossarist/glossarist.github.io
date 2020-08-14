import { DocsPageNavItem, DocsPageItem } from "types"


export function sortItemsByImportance(items: DocsPageNavItem[]): DocsPageNavItem[] {
  var importances = items.map((i, idx) => ({ idx, importance: i.importance || 0 }))
  importances.sort((i1, i2) => i2.importance - i1.importance)
  return importances.map(i => items[i.idx])
}


export function itemIsNonEmpty(i: DocsPageItem) {
  return i.items?.length > 0 || i.hasContents || i.excerpt || i.summary
}
