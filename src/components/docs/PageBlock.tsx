import React from 'react'
import styled from 'styled-components'

import { DocsPageItem, MediaItem } from 'types'
import DoubleDPIImage from 'components/DoubleDPIImage'
import Asciidoc from 'components/Asciidoc'
import { Link } from 'components/linksButtons'

import { sortItemsByImportance, itemIsNonEmpty } from './util'
import NavItem from './NavItem'
import { ToCItemList } from './pageElements'


interface PageBlockProps {
  item: DocsPageItem
}
const PageBlock: React.FC<PageBlockProps> = function ({ item }) {
  const items = sortItemsByImportance((item.items || []).filter(itemIsNonEmpty))
  const coverMedia: MediaItem | null = item.media?.length > 0 ? item.media[0] : null

  return (
    <DocsPageBlock>
      {coverMedia
        ? <DoubleDPIImage
            src={`./${item.path}/${coverMedia.filename}`}
            dimensions={coverMedia.dimensions} />
        : null}

      {item.hasContents || item.items?.length > 0
        ? <h3><Link to={item.path}>{item.title}</Link></h3>
        : <h3 id={item.id}>{item.title}</h3>}

      {item.summary
        ? <Asciidoc content={item.summary} />
        : <p>{item.excerpt}</p>}

      {items.length > 0
        ? <ToCItemList>
            {items.map(p =>
              <li key={p.path}>
                <NavItem item={p} relative />
              </li>
            )}
          </ToCItemList>
        : null}
    </DocsPageBlock>
  )
}


const DocsPageBlock = styled.article`
  overflow: hidden;
`


export default PageBlock
