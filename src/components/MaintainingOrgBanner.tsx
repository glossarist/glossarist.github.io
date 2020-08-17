import React from 'react'
import { SymbolImage } from 'components/Logo'
import { UnstyledLink } from 'components/linksButtons'
import organizationLogoImage from '../assets/riboseopen-logo-dark.svg'


const MaintainingOrgBanner: React.FC<{}> = function () {
  return (
    <UnstyledLink to="https://open.ribose.com">
      <SymbolImage
        style={{ marginBottom: '1rem' }}
        size={10}
        src={organizationLogoImage}
        className="org-logo" />
    </UnstyledLink>
  )
}


export default MaintainingOrgBanner
