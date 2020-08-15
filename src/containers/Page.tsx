import React from 'react'
import styled from 'styled-components'
import { Logo } from '../components/Logo'
import { MaintainingOrgBanner } from '../components/MaintainingOrgBanner'


interface PageProps {
  title?: string
  logoSize?: number
  logoLink?: string
}
const Page: React.FC<PageProps> =
function ({ title, logoSize, logoLink, children }) {

  return (
    <>
      <header>
        <Logo size={logoSize || 42} title={title || 'Glossarist'} linkTo={logoLink} />
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
