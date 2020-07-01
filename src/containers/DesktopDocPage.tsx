import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { useRouteData } from 'react-static'
import { DocPage, DocsPageNavItem, DocsPageItem } from '../../types'
import { Backlink, Link } from 'components/Links'
import { app } from '../GlobalStyle'
import { PageTitle, Lead } from 'components/typography'
import { Asciidoc } from 'components/Asciidoc'
import * as theme from '../theme/colors'


const DESKTOP_DOCS_ROOT = '/desktop/docs/'


export default () => {
  const { docPage, docsNav }: { docPage: DocPage, docsNav: DocsPageNavItem[] } = useRouteData()
  const items = sortByImportance(docPage.items || []).filter(showOnPage)
  const navSorted = sortByImportance(docsNav || [])

  return (
    <DocsPageWrapper>
      <Helmet>
        <title>{docPage.data?.title} — Glossarist Desktop app reference</title>
      </Helmet>

      <GlobalStyle />

      <DocsHeader><h1>Glossarist Desktop documentation</h1></DocsHeader>

      <div className="main">
        <PageTitle>{docPage.data?.title}</PageTitle>

        <div className="backlink">
          <Backlink />
        </div>

        <Lead>
          <p>
            {docPage.data?.excerpt}
          </p>
        </Lead>

        <Asciidoc className="summary" content={docPage.data?.summary || ''} />
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
                  <DocsNavLink item={i} childFilter={showInNav} />
                </li>
              )}
            </DocsPageNav>
          </nav>
        : null}

    </DocsPageWrapper>
  )
}


function sortByImportance(items: DocsPageNavItem[]): DocsPageNavItem[] {
  var importances = items.map((i, idx) => ({ idx, importance: i.importance || 0 }))
  importances.sort((i1, i2) => i2.importance - i1.importance);
  return importances.map(i => items[i.idx]);
}


interface DocsNavLinkProps {
  item: DocsPageNavItem
  relative?: boolean
  childLevels?: number
  childFilter?: (item: DocsPageNavItem) => boolean
}
const DocsNavLink: React.FC<DocsNavLinkProps> = function ({ item, relative, childLevels, childFilter }) {
  const itemFilter = childFilter || showOnPage;
  const items = sortByImportance((item.items || []).filter(itemFilter));
  return (
    <>
      {item.hasContents || item.items?.length > 0
        ? <Link
              to={item.path}
              relative={relative ? true : DESKTOP_DOCS_ROOT}>
            {item.title}
          </Link>
        : <span>
            {item.title}
          </span>}

      {(childLevels === undefined || childLevels > 0) && items.length > 0
        ? <ul>
            {items.map(p =>
              <li key={p.path}>
                <DocsNavLink
                  item={p}
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
  const items = sortByImportance((item.items || []).filter(showOnPage));
  return (
    <DocsPageBlock>
      {item.hasContents || item.items?.length > 0
        ? <h3><Link to={item.path}>{item.title}</Link></h3>
        : <h3 id={item.id}>{item.title}</h3>}

      <p>{item.excerpt}</p> 
      
      {item.summary
        ? <Asciidoc content={item.summary} />
        : null}
      
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


function showOnPage(i: DocsPageItem) {
  return i.items?.length > 0 || i.hasContents || i.excerpt || i.summary;
}

function showInNav(i: DocsPageNavItem) {
  return i.items?.length > 0 || i.hasContents;
}


const NAV_WIDTH_REM = 18;
const HEADER_HEIGHT_REM = 8;


const GlobalStyle = createGlobalStyle`
  @media screen and (min-width: 800px) {
    ${app} {
      margin-left: 0;
      margin-right: 0;
      align-self: stretch;
    }

    ${app} > main {
      margin-left: ${NAV_WIDTH_REM + 2}rem;
      padding-top: 2rem;
      padding-right: 2rem;

      flex: 1;
      overflow-y: auto;
    }

    ${app} > footer {
      width: ${NAV_WIDTH_REM}rem;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      justify-content: center;
    }

    ${app} > header {
      align-self: unset;
      width: ${NAV_WIDTH_REM}rem;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;

      > a {
        justify-content: center;
        height: ${HEADER_HEIGHT_REM}rem;
        padding: 0;
        margin: 0;
      }

      h1 {
        display: none;
      }
    }
  }
`


const DocsHeader = styled.header`
  @media screen and (min-width: 800px) {
    margin-top: -2rem;
    height: ${HEADER_HEIGHT_REM}rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  h1 {
    font-family: Lora;
    margin: 0;
    padding: 0;
    font-size: 100%;
    text-transform: uppercase;
    letter-spacing: .02em;
  }
`


const DocsPageWrapper = styled.div`
  > nav {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  > .main {
    padding-bottom: 2rem;

    > .backlink {
      margin-top: -.5rem;
      margin-bottom: 1rem;

      a {
        text-decoration: none;
        font-size: 90%;
      }
    }
    > .items {
      article + article {
        margin-top: 1rem;
      }
    }

    .summary {
      margin-bottom: 1rem;
    }
  }

  @media screen and (min-width: 800px) {
    > .main {
      max-width: 50rem;

      h2 {
        margin-top: 0;
      }
    }
    > nav {
      margin-top: 0;
      display: block;

      width: ${NAV_WIDTH_REM}rem;
      position: fixed;
      top: ${HEADER_HEIGHT_REM}rem;
      left: 0;
      bottom: 0;
      padding-left: 2rem;

      overflow-y: auto;
      overflow-x: hidden;

      a:visited {
        opacity: .9;
      }
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

    a {
      text-decoration: none;
    }
  }
`


const DocsPageBlock = styled.article`
  border: ${theme.scale[0].darken(.5).desaturate(0).css()} .1rem solid;
  padding: 0 1rem;
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