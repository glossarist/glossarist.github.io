import React from 'react'
import { SymbolImage } from 'components/Logo'
import { UnstyledLink } from 'components/linksButtons'
import organizationLogoImage from '../assets/riboseopen-logo-dark.svg'


const MaintainingOrgBanner: React.FC<{}> = function () {
  return (
    <UnstyledLink to="https://open.ribose.com">
      <SymbolImage
        size={17}
        style={{ paddingLeft: '.5rem' }}
        src={organizationLogoImage} />
    </UnstyledLink>
  )
}


export default MaintainingOrgBanner
