// VitePress-style admonition containers (::: tip / ::: warning / ::: info / ::: danger)
// Used as a rehype plugin in astro.config.mjs (passed via unified()).
//
// Requires blank lines around ::: markers in source markdown so they parse
// as separate <p>::: type</p> ... <p>:::</p> blocks (use scripts/normalize-admonitions.mjs).
//
// Transforms <p>::: type</p> [content...] <p>:::</p> into
// <div class="custom-block {type}"><p class="custom-block-title">{Title}</p>[content...]</div>

const DEFAULT_TITLES = {
  tip: 'TIP',
  info: 'INFO',
  warning: 'WARNING',
  danger: 'WARNING',
  details: 'Details',
}

const OPEN_RE = /^:::\s*(tip|info|warning|danger|details)(?:[ \t]+(.+?))?[ \t]*$/
const CLOSE_RE = /^:::\s*$/

export function rehypeVitePressAdmonitions() {
  return transform

  function transform(tree) {
    if (!tree || !tree.children) return
    tree.children = collect(tree.children)
    for (const child of tree.children) {
      if (child && child.type === 'element') {
        transform(child)
      }
    }
  }

  function collect(children) {
    const out = []
    let i = 0
    while (i < children.length) {
      const open = matchOpen(children[i])
      if (open) {
        const { type, title } = open
        const inner = []
        i++
        while (i < children.length && !matchClose(children[i])) {
          inner.push(children[i])
          i++
        }
        if (i < children.length) i++ // consume closing :::
        out.push(buildContainer(type, title, inner))
      } else {
        out.push(children[i])
        i++
      }
    }
    return out
  }

  function matchOpen(node) {
    const text = paragraphText(node)
    if (text === null) return null
    const m = text.match(OPEN_RE)
    if (!m) return null
    return { type: m[1], title: m[2] || DEFAULT_TITLES[m[1]] }
  }

  function matchClose(node) {
    const text = paragraphText(node)
    if (text === null) return false
    return CLOSE_RE.test(text)
  }

  function paragraphText(node) {
    if (!node || node.type !== 'element' || node.tagName !== 'p') return null
    if (!node.children || node.children.length === 0) return null
    const parts = []
    for (const c of node.children) {
      if (c.type === 'text') { parts.push(c.value); continue }
      return null
    }
    return parts.join('')
  }

  function buildContainer(type, title, innerChildren) {
    return {
      type: 'element',
      tagName: 'div',
      properties: { className: ['custom-block', type] },
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: { className: ['custom-block-title'] },
          children: [{ type: 'text', value: title }],
        },
        ...innerChildren,
      ],
    }
  }
}

export default rehypeVitePressAdmonitions
