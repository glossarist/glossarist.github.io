import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteData, useRoutePath } from 'react-static'

import { DocPage as DocPageComponent } from '@riboseinc/aperis-doc-pages'
import { DocPage, DocsPageNavItem } from '@riboseinc/aperis-doc-pages/types'
import Asciidoc from 'components/Asciidoc'

import Logo from 'components/Logo'

import { Link, normalizeInternalHRef } from 'components/linksButtons'
import MaintainingOrgBanner from 'components/MaintainingOrgBanner'
import { useLocation } from '@reach/router'
import styled from 'styled-components'


const DOCS_ROOT = '/docs/'


export default () => {
  const { docPage, docsNav }: { docPage: DocPage, docsNav: DocsPageNavItem[] } = useRouteData()
  const loc = useLocation().pathname
  const routePath = (useRoutePath as () => string)()

  function pathIsCurrent(path: string, relative?: string | boolean) {
    return normalizeInternalHRef(loc, path, relative) === `/${routePath}/`
  }


  return (
    <>
      <Helmet>
        <title>{docPage.data?.title} — Glossarist documentation</title>
      </Helmet>

      <DocPageComponent
        AsciidocComponent={Asciidoc}
        LinkComponent={Link}
        pathIsCurrent={pathIsCurrent}
        rootURLPath={DOCS_ROOT}
        header={<DocPageLogo
          size={36}
          title="Glossarist"
          linkTo="/" />}
        footer={<MaintainingOrgBanner />}
        page={docPage}
        nav={docsNav}
      />
    </>
  )
}


const DocPageLogo = styled(Logo)`
  @media screen and (max-width: 800px) {
    justify-content: center;
  }
`
