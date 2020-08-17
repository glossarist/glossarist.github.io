import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Logo from '../components/Logo'
import MaintainingOrgBanner from '../components/MaintainingOrgBanner'


export const pageContainerSelector = 'body > #root > :first-child > :first-child'


const GlobalStyle = createGlobalStyle`
  @media screen and (min-width: 800px) {
    body, body > #root, body > #root > :first-child {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
    }
  }

  ${pageContainerSelector} {
    margin-left: 1rem;
    margin-right: 1rem;

    @media screen and (min-width: 800px) {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;

      margin-left: 10vw;
      margin-right: 10vw;
      align-self: center;
      align-items: stretch;
      justify-content: center;
    }
  }
`


interface PageProps {
  title?: string
  logoSize?: number
  logoLink?: string
}
const Page: React.FC<PageProps> =
function ({ title, logoSize, logoLink, children }) {

  return (
    <>
      <GlobalStyle />

      <header>
        <Logo
          style={{ margin: '2rem 0', justifyContent: 'center' }}
          size={logoSize || 60}
          title={title || 'Glossarist'}
          linkTo={logoLink} />
      </header>

      <main>
        {children}
      </main>

      <Footer>
        <MaintainingOrgBanner />
      </Footer>
    </>
  )
}


export const Footer = styled.footer`
  flex-shrink: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  padding: 1.5rem 0;
  opacity: .5;

  &:hover {
    opacity: 1;
  }

  @media screen and (min-width: 800px) {
    justify-content: flex-end;
  }
`


export default Page
