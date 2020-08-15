import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { useRouteData } from 'react-static'

import { DocPage, DocsPageNavItem } from '../../types'
import { Backlink } from '../components/linksButtons'
import { PageTitle } from '../components/typography'
import { Asciidoc } from '../components/Asciidoc'
import { pageContainerSelector } from '../GlobalStyle'

import { sortItemsByImportance, itemIsNonEmpty } from '../components/docs/util'
import {
  Main, Lead, GlobalNav, NavItemList,
  SIDEBAR_BACKGROUND, SIDEBAR_WIDTH_REM, HEADER_HEIGHT_REM,
} from '../components/docs/pageElements'

import PageBlock from '../components/docs/PageBlock'
import NavItem from '../components/docs/NavItem'
import { Logo } from '../components/Logo'
import { MaintainingOrgBanner } from '../components/MaintainingOrgBanner'
import { Footer } from './Page'


const DOCS_ROOT = '/docs/'


export default () => {
  const { docPage, docsNav }: { docPage: DocPage, docsNav: DocsPageNavItem[] } = useRouteData()

  const items = sortItemsByImportance(docPage.items || []).filter(itemIsNonEmpty)
  const navSorted = sortItemsByImportance(docsNav || [])

  return (
    <>
      <GlobalStyle />

      <Helmet>
        <title>{docPage.data?.title} — Glossarist documentation</title>
      </Helmet>

      <DocsPageHeader>
        <Logo size={32} title="Glossarist" linkTo="/" />
      </DocsPageHeader>

      <DocsPageMain role="presentation">
        <Main>
          <PageTitle>{docPage.data?.title}</PageTitle>

          <BacklinkWrapper role="presentation">
            <Backlink />
          </BacklinkWrapper>

          <Lead>
            {docPage.data?.summary
              ? <Asciidoc
                  style={{ marginBottom: '1rem' }}
                  content={docPage.data?.summary || ''} />
              : <p>{docPage.data?.excerpt}</p>}
          </Lead>

          <Asciidoc content={docPage.data?.contents || ''} />

          {items.length > 0
            ? <div className="blocks">
                {items.map(p =>
                  <PageBlock key={p.path} item={p} />
                )}
              </div>
            : null}
        </Main>

        {navSorted.length > 0
          ? <GlobalNav>
              <NavItemList>
                {navSorted.map(i =>
                  <li key={i.path}>
                    <NavItem
                      linkStyle={{ color: '#666' }}
                      relative={DOCS_ROOT}
                      unstyled
                      item={i}
                      childFilter={i => i.items?.length > 0 || i.hasContents} />
                  </li>
                )}
              </NavItemList>
            </GlobalNav>
          : null}
      </DocsPageMain>

      <DocsPageFooter>
        <MaintainingOrgBanner />
      </DocsPageFooter>
    </>
  )
}


const GlobalStyle = createGlobalStyle`
  ${pageContainerSelector} {
    @media screen and (min-width: 800px) {
      margin-left: 0;
      margin-right: 0;
      align-self: stretch;
    }
  }
`


const BacklinkWrapper = styled.div`
  margin-top: -.5rem;
  margin-bottom: 1rem;
  font-size: 90%;
`


const DocsPageHeader = styled.header`
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

  @media screen and (min-width: 800px) {
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
`

const DocsPageMain = styled.div`
  @media screen and (min-width: 800px) {
    margin-left: ${SIDEBAR_WIDTH_REM}rem;
    padding-left: 2rem;
    padding-top: 1.75rem;
    padding-right: 2rem;

    flex: 1;
    overflow-y: auto;
  }
`


const DocsPageFooter = styled(Footer)`
  @media screen and (min-width: 800px) {
    width: ${SIDEBAR_WIDTH_REM}rem;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 0;
    padding-left: 2rem;
    justify-content: flex-start;
  }
`
