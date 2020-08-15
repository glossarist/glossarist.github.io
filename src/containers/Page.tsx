import React from 'react'
import styled from 'styled-components'
import { SymbolImage, Logo } from '../components/Logo'
import organizationLogoImage from '../assets/riboseopen-logo-dark.svg'
import { UnstyledLink } from '../components/linksButtons'


interface PageProps {
  title?: string
  logoSize?: number
  logoLink?: string
  PageHeader?: React.ElementType
  PageMain?: React.ElementType
  PageFooter?: React.ElementType
}
const Page: React.FC<PageProps> =
function ({ title, logoSize, logoLink, children, PageHeader, PageMain, PageFooter }) {

  const HeaderComponent: React.ElementType = PageHeader || DefaultHeader
  const MainComponent: React.ElementType = PageMain || DefaultMain
  const FooterComponent: React.ElementType = PageFooter || DefaultFooter

  return (
    <>
      <HeaderComponent>
        <Logo size={logoSize || 42} title={title || 'Glossarist'} linkTo={logoLink} />
      </HeaderComponent>

      <MainComponent>
        {children}
      </MainComponent>

      <FooterComponent>
        <UnstyledLink to="https://open.ribose.com">
          <SymbolImage size={10} src={organizationLogoImage} className="org-logo" />
        </UnstyledLink>
      </FooterComponent>
    </>
  )
}


export const DefaultMain = styled.main``


export const DefaultHeader = styled.header``


export const DefaultFooter = styled.footer`
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
