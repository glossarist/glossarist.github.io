import React from 'react'
import { SymbolImage, Logo } from '../components/Logo'
import organizationLogoImage from '../assets/riboseopen-logo-dark.svg'
import { UnstyledLink } from '../components/linksButtons'


interface PageProps {
  title?: string
  logoSize?: number
  logoLink?: string
}
const Page: React.FC<PageProps> = function ({ title, logoSize, logoLink, children }) {
  return (
    <>
      <header>
        <Logo size={logoSize || 42} title={title || 'Glossarist'} linkTo={logoLink} />
      </header>

      <main>
        {children}
      </main>

      <footer>
        <UnstyledLink to="https://open.ribose.com">
          <SymbolImage size={10} src={organizationLogoImage} className="org-logo" />
        </UnstyledLink>
      </footer>
    </>
  )
}


export default Page
