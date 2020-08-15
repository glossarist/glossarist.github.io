import React from 'react'
import styled from 'styled-components'

import { DocsPageItem, MediaItem } from 'types'
import DoubleDPIImage from 'components/DoubleDPIImage'
import Asciidoc from 'components/Asciidoc'
import { Link } from 'components/linksButtons'

import { sortItemsByImportance, itemIsNonEmpty } from './util'
import NavItem from './NavItem'


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
        ? <ul className="subitems">
            {items.map(p =>
              <li key={p.path}>
                <NavItem item={p} relative childLevels={0} />
              </li>
            )}
          </ul>
        : null}
    </DocsPageBlock>
  )
}


const DocsPageBlock = styled.article`
  overflow: hidden;

  ul.subitems {
    display: flex;
    margin: 0;
    padding: 0 0 1rem 0;
    list-style: none;
    overflow-x: auto;

    > * + * {
      margin-left: .5rem;

      &:before {
        content: "•";
        margin-right: .5rem;
      }
    }

    > * {
      white-space: nowrap;
      font-size: 90%;
      color: grey;
    }
  }
`


export default PageBlock
