import React from 'react'
import styled from 'styled-components'

import { DocsPageItem, MediaItem } from 'types'
import DoubleDPIImage, { DoubleDPIImageProps } from 'components/DoubleDPIImage'
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
        ? <CoverMedia
            src={`./${item.path}/${coverMedia.filename}`}
            dimensions={coverMedia.dimensions} />
        : null}

      {item.hasContents || item.items?.length > 0
        ? <h3 className="title"><Link to={item.path}>{item.title}</Link></h3>
        : <h3 className="title" id={item.id}>{item.title}</h3>}

      {item.summary
        ? <Asciidoc inline className="excerpt" content={item.summary} />
        : <p className="excerpt">{item.excerpt}</p>}

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


const CoverMedia: React.FC<DoubleDPIImageProps> =
function ({ src, dimensions, style, className }) {
  return (
    <>
      <CoverMediaOverlay role="presentation" />
      <CoverMediaImage
        aria-role="presentation"
        objectFit="fill"
        className={className}
        style={style}
        src={src}
        dimensions={dimensions} />
    </>
  )
}

const absolutelyPositionedOverlay = `
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`

const CoverMediaOverlay = styled.div`
  ${absolutelyPositionedOverlay}
  background: whiteSmoke;
  opacity: .8;
  z-index: 2;
`

const CoverMediaImage = styled(DoubleDPIImage)`
  ${absolutelyPositionedOverlay}
  z-index: 1;
  filter: blur(4px);
`


const DocsPageBlock = styled.article`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

  > .title {
    font-weight: 300;
    margin-top: 1rem;
    margin-bottom: .25rem;
    z-index: 3;
  }

  > .excerpt {
    font-size: 85%;
    z-index: 3;
  }
`


export default PageBlock
