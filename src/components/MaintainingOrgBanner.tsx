import React from 'react'
import { SymbolImage } from '../components/Logo'
import organizationLogoImage from '../assets/riboseopen-logo-dark.svg'
import { UnstyledLink } from '../components/linksButtons'


export const MaintainingOrgBanner: React.FC<{}> = function () {
  return (
    <UnstyledLink to="https://open.ribose.com">
      <SymbolImage size={10} src={organizationLogoImage} className="org-logo" />
    </UnstyledLink>
  )
}
