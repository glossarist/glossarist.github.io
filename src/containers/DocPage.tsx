import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { useRouteData } from 'react-static'

import { DocPage, DocsPageNavItem, DocsPageItem, MediaItem } from '../../types'
import { default as Page } from '../containers/Page'
import { Backlink, UnstyledLink, Link } from '../components/linksButtons'
import { PageTitle, Lead } from '../components/typography'
import { Asciidoc } from '../components/Asciidoc'
import { app } from '../GlobalStyle'


const DOCS_ROOT = '/docs/'


export default () => {
  const { docPage, docsNav }: { docPage: DocPage, docsNav: DocsPageNavItem[] } = useRouteData()

  const items = sortByImportance(docPage.items || []).filter(showOnPage)
  const navSorted = sortByImportance(docsNav || [])

  return (
    <Page title="Glossarist" logoSize={32} logoLink="/">
      <DocsPageWrapper>
        <Helmet>
          <title>{docPage.data?.title} — Glossarist documentation</title>
        </Helmet>

        <GlobalStyle />

        <div className="main">
          <PageTitle>{docPage.data?.title}</PageTitle>

          <div className="backlink">
            <Backlink />
          </div>

          <DocsPageLead>
            {docPage.data?.summary
              ? <Asciidoc className="summary" content={docPage.data?.summary || ''} />
              : <p>{docPage.data?.excerpt}</p>}
          </DocsPageLead>

          <Asciidoc className="contents" content={docPage.data?.contents || ''} />

          {items.length > 0
            ? <div className="items">
                {items.map(p =>
                  <DocsPageItemBlock key={p.path} item={p} />
                )}
              </div>
            : null}
        </div>

        {navSorted.length > 0
          ? <nav>
              <DocsPageNav>
                {navSorted.map(i =>
                  <li key={i.path}>
                    <DocsNavLink
                      linkStyle={{ color: '#666' }}
                      unstyled
                      item={i}
                      childFilter={showInNav} />
                  </li>
                )}
              </DocsPageNav>
            </nav>
          : null}

      </DocsPageWrapper>
    </Page>
  )
}


function sortByImportance(items: DocsPageNavItem[]): DocsPageNavItem[] {
  var importances = items.map((i, idx) => ({ idx, importance: i.importance || 0 }))
  importances.sort((i1, i2) => i2.importance - i1.importance)
  return importances.map(i => items[i.idx])
}


interface DocsNavLinkProps {
  item: DocsPageNavItem
  relative?: boolean
  childLevels?: number
  unstyled?: boolean
  linkStyle?: React.CSSProperties
  childFilter?: (item: DocsPageNavItem) => boolean
}
const DocsNavLink: React.FC<DocsNavLinkProps> =
function ({ item, unstyled, linkStyle, relative, childLevels, childFilter }) {
  const itemFilter = childFilter || showOnPage
  const items = sortByImportance((item.items || []).filter(itemFilter))
  const Comp = unstyled ? UnstyledLink : Link

  return (
    <>
      {item.hasContents || item.items?.length > 0
        ? <Comp
              style={linkStyle}
              to={item.path}
              relative={relative ? true : DOCS_ROOT}>
            {item.title}
          </Comp>
        : <span>
            {item.title}
          </span>}

      {(childLevels === undefined || childLevels > 0) && items.length > 0
        ? <ul>
            {items.map(p =>
              <li key={p.path}>
                <DocsNavLink
                  item={p}
                  linkStyle={linkStyle}
                  unstyled={unstyled}
                  relative={relative}
                  childFilter={childFilter}
                  childLevels={childLevels !== undefined
                    ? childLevels - 1
                    : undefined} />
              </li>
            )}
          </ul>
        : null}
    </>
  )
}

interface DocsPageProps {
  item: DocsPageItem
}
const DocsPageItemBlock: React.FC<DocsPageProps> = function ({ item }) {
  const items = sortByImportance((item.items || []).filter(showOnPage))
  const coverMedia: MediaItem | null = item.media?.length > 0 ? item.media[0] : null

  return (
    <DocsPageBlock>
      {coverMedia
        ? <HiDPIImage
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
                <DocsNavLink item={p} relative childLevels={0} />
              </li>
            )}
          </ul>
        : null}
    </DocsPageBlock>
  )
}


const HiDPIImage:
React.FC<{ src: string, dimensions: { width: number, height: number } }> =
function ({ src, dimensions }) {
  return <img
    src={src}
    style={{
      width: `${dimensions.width / 2}px`,
      height: `${dimensions.height / 2}px`,
      objectFit: 'contain',
      objectPosition: 'top left',
      maxHeight: '10rem',
    }} />
}


function showOnPage(i: DocsPageItem) {
  return i.items?.length > 0 || i.hasContents || i.excerpt || i.summary
}

function showInNav(i: DocsPageNavItem) {
  return i.items?.length > 0 || i.hasContents
}


const SIDEBAR_WIDTH_REM = 18
const SIDEBAR_BACKGROUND = 'whiteSmoke'
const HEADER_HEIGHT_REM = 8


const GlobalStyle = createGlobalStyle`
  ${app} > header {
    margin: 0 -1rem;
    background: ${SIDEBAR_BACKGROUND};

    > a {
      flex-flow: row nowrap;
    }
    img {
      margin: 0;
    }
    h1 {
      font-size: 110%;
      text-align: left;
    }
  }
  @media screen and (min-width: 800px) {
    ${app} {
      margin-left: 0;
      margin-right: 0;
      align-self: stretch;
    }

    ${app} > main {
      margin-left: ${SIDEBAR_WIDTH_REM}rem;
      padding-left: 2rem;
      padding-top: 1.75rem;
      padding-right: 2rem;

      flex: 1;
      overflow-y: auto;
    }

    ${app} > footer {
      width: ${SIDEBAR_WIDTH_REM}rem;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      padding-left: 2rem;
      justify-content: flex-start;
    }

    ${app} > header {
      align-self: unset;
      width: ${SIDEBAR_WIDTH_REM}rem;
      overflow: hidden;
      position: fixed;
      padding-left: 1rem;
      top: 0;
      left: 0;
      background: ${SIDEBAR_BACKGROUND};
      margin: 0;

      > a {
        height: ${HEADER_HEIGHT_REM}rem;
        padding: 0;
        margin: 0;
        justify-content: flex-start;
      }
    }
  }
`


const DocsPageLead = styled(Lead)`
  margin-bottom: 2rem;
`


const DocsPageWrapper = styled.div`
  > nav {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    font-size: 92%;
  }

  > .main {
    padding-bottom: 1rem;

    > .backlink {
      margin-top: -.5rem;
      margin-bottom: 1rem;
      font-size: 90%;
    }

    > .items {
      article + article {
        margin-top: 1rem;
        border-top: 1px solid silver;
      }
    }

    .summary {
      margin-bottom: 1rem;
    }
  }

  @media screen and (min-width: 800px) {
    > .main {
      padding-top: 1rem;
      max-width: 50rem;

      h2 {
        margin-top: 0;
      }
    }
    > nav {
      margin-top: 0;
      display: block;

      width: ${SIDEBAR_WIDTH_REM}rem;
      position: fixed;
      top: ${HEADER_HEIGHT_REM}rem;
      left: 0;
      bottom: 0;
      padding-left: 2rem;
      padding-right: 1rem;

      overflow-y: auto;
      overflow-x: hidden;

      background: ${SIDEBAR_BACKGROUND};
    }
  }
`


const DocsPageNav = styled.ul`
  &, ul {
    list-style: none;
    padding-left: 0;
  }

  li ul {
    padding-left: 1.2rem;
  }

  li {
    margin-top: .5rem;
  }
`


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
