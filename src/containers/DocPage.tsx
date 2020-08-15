import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { useRouteData } from 'react-static'

import { DocPage, DocsPageNavItem } from 'types'
import { Backlink } from 'components/linksButtons'
import { PageTitle } from 'components/typography'
import Asciidoc from 'components/Asciidoc'

import PageBlock from 'components/docs/PageBlock'
import GlobalNavMenuItem from 'components/docs/GlobalNavMenuItem'
import Logo from 'components/Logo'
import MaintainingOrgBanner from 'components/MaintainingOrgBanner'

import { sortItemsByImportance, itemIsNonEmpty } from 'components/docs/util'
import {
  Main, Lead,
  SIDEBAR_BACKGROUND, SIDEBAR_WIDTH_REM, HEADER_HEIGHT_REM, SIDEBAR_BORDER,
  GlobalNav, GlobalNavTopLevelItemList, PageToC, ToCItemList,
} from 'components/docs/pageElements'

import { pageContainerSelector } from '../GlobalStyle'

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

          {docPage.data.sections.length > 0
            ? <PageToC>
                <h3 className="header">In this article</h3>
                <ToCItemList>
                  {docPage.data.sections.map(s =>
                    <li>
                      <a href={`#${s.id}`}>{s.title}</a>
                    </li>
                  )}
                </ToCItemList>
              </PageToC>
            : null}

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
              <GlobalNavTopLevelItemList>
                {navSorted.map(i =>
                  <GlobalNavMenuItem item={i} relative={DOCS_ROOT} />
                )}
              </GlobalNavTopLevelItemList>
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
  border-right: ${SIDEBAR_BORDER};

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
    margin: 0;

    > a {
      height: ${HEADER_HEIGHT_REM}rem;
      padding: 0;
      padding-top: 1rem;
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
