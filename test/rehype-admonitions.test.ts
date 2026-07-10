import { describe, it, expect } from 'vitest'
import { rehypeVitePressAdmonitions } from '../scripts/rehype-admonitions.mjs'

// Helper: build a hast tree with a sequence of <p> children containing the
// given text strings, then run the admonition plugin and return the result.
function transform(paragraphs: string[]) {
  const tree = {
    type: 'root',
    children: paragraphs.map(text => ({
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{ type: 'text', value: text }],
    })),
  }
  rehypeVitePressAdmonitions()(tree)
  return tree
}

function findContainer(tree: any) {
  return tree.children.find((c: any) => c.type === 'element' && c.tagName === 'div')
}

describe('rehypeVitePressAdmonitions', () => {
  it('wraps a ::: tip block in a div.custom-block.tip', () => {
    const tree = transform([
      '::: tip',
      'Helpful text.',
      ':::',
    ])
    const div = findContainer(tree)
    expect(div).toBeDefined()
    expect(div.properties.className).toEqual(['custom-block', 'tip'])
    expect(div.children[0].tagName).toBe('p')
    expect(div.properties.className.includes('custom-block-title'))
    expect(div.children[0].properties.className).toEqual(['custom-block-title'])
    expect(div.children[0].children[0].value).toBe('TIP')
    expect(div.children[1].children[0].value).toBe('Helpful text.')
  })

  it('supports all five admonition types', () => {
    for (const type of ['tip', 'info', 'warning', 'danger', 'details']) {
      const tree = transform([`::: ${type}`, `Body for ${type}.`, ':::'])
      const div = findContainer(tree)
      expect(div.properties.className, `type ${type}`).toEqual(['custom-block', type])
    }
  })

  it('uses default uppercase titles when none provided', () => {
    const cases = [
      ['tip', 'TIP'],
      ['info', 'INFO'],
      ['warning', 'WARNING'],
      ['danger', 'WARNING'],
      ['details', 'Details'],
    ] as const
    for (const [type, expectedTitle] of cases) {
      const tree = transform([`::: ${type}`, 'body', ':::'])
      const div = findContainer(tree)
      expect(div.children[0].children[0].value, `type ${type}`).toBe(expectedTitle)
    }
  })

  it('uses a custom title when provided on the same line', () => {
    const tree = transform([
      '::: tip Pro Tip For You',
      'Body.',
      ':::',
    ])
    const div = findContainer(tree)
    expect(div.children[0].children[0].value).toBe('Pro Tip For You')
  })

  it('does not match unknown admonition types', () => {
    const tree = transform([
      '::: unknown-type',
      'Body.',
      ':::',
    ])
    const div = findContainer(tree)
    expect(div).toBeUndefined()
    // The original three paragraphs survive unchanged
    expect(tree.children.length).toBe(3)
    expect(tree.children[0].children[0].value).toBe('::: unknown-type')
  })

  it('captures multiple paragraphs between markers', () => {
    const tree = transform([
      '::: info',
      'First paragraph.',
      'Second paragraph.',
      ':::',
    ])
    const div = findContainer(tree)
    expect(div.children.length).toBe(3) // title + 2 paragraphs
    expect(div.children[1].children[0].value).toBe('First paragraph.')
    expect(div.children[2].children[0].value).toBe('Second paragraph.')
  })

  it('handles multiple admonitions in the same document', () => {
    const tree = transform([
      '::: tip',
      'First tip.',
      ':::',
      'In between paragraph.',
      '::: warning',
      'A warning.',
      ':::',
    ])
    const divs = tree.children.filter((c: any) => c.type === 'element' && c.tagName === 'div')
    expect(divs.length).toBe(2)
    expect(divs[0].properties.className).toEqual(['custom-block', 'tip'])
    expect(divs[1].properties.className).toEqual(['custom-block', 'warning'])
    // The in-between paragraph survives
    const between = tree.children.find((c: any) =>
      c.type === 'element' && c.tagName === 'p' &&
      c.children.some((ch: any) => ch.value === 'In between paragraph.')
    )
    expect(between).toBeDefined()
  })

  it('preserves content after the closing marker', () => {
    const tree = transform([
      '::: tip',
      'Inside.',
      ':::',
      'After.',
    ])
    const div = findContainer(tree)
    const afterPara = tree.children.find((c: any) =>
      c.type === 'element' && c.tagName === 'p' &&
      c.children.some((ch: any) => ch.value === 'After.')
    )
    expect(div).toBeDefined()
    expect(afterPara).toBeDefined()
  })

  it('does not transform paragraphs without ::: markers', () => {
    const tree = transform([
      'Just a normal paragraph.',
      'Another one.',
    ])
    expect(tree.children.length).toBe(2)
    expect(tree.children.every((c: any) => c.tagName === 'p')).toBe(true)
    expect(tree.children.find((c: any) => c.tagName === 'div')).toBeUndefined()
  })

  it('handles unclosed admonition by extending to end of document', () => {
    const tree = transform([
      '::: tip',
      'No closer below.',
      'More body.',
    ])
    // Without a closing :::, the plugin still wraps everything after the
    // opener into the container (avoids leaving literal ::: text visible).
    const div = findContainer(tree)
    expect(div).toBeDefined()
    expect(div.properties.className).toEqual(['custom-block', 'tip'])
  })
})
