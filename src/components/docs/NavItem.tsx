import React from 'react'

import { DocsPageNavItem } from 'types'
import { Link, UnstyledLink, LinkProps } from 'components/linksButtons'


interface NavItemProps {
  item: DocsPageNavItem
  active?: boolean
  relative?: LinkProps["relative"]
  unstyled?: boolean
}
const NavItem: React.FC<NavItemProps> =
function ({ item, active, unstyled, relative }) {
  const isActive = active || false
  const showAsLink = !isActive && (item.hasContents || item.items?.length > 0)
  const LinkComponent = unstyled ? UnstyledLink : Link

  let label: JSX.Element
  if (showAsLink) {
    label = (
      <LinkComponent
          style={{ color: '#666' }}
          to={item.path}
          relative={relative}>
        {item.title}
      </LinkComponent>
    )
  } else if (isActive) {
    label = (
      <em aria-current="page">
        {item.title}
      </em>
    )
  } else {
    label = (
      <span>
        {item.title}
      </span>
    )
  }

  return label
}

export default NavItem
