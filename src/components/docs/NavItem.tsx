import React from 'react'

import { DocsPageNavItem } from 'types'
import { Link, UnstyledLink, LinkProps } from 'components/linksButtons'

import { sortItemsByImportance, itemIsNonEmpty } from './util'


interface NavItemProps {
  item: DocsPageNavItem
  relative?: LinkProps["relative"]
  childLevels?: number
  unstyled?: boolean
  linkStyle?: React.CSSProperties
  childFilter?: (item: DocsPageNavItem) => boolean
}
const NavItem: React.FC<NavItemProps> =
function ({ item, unstyled, linkStyle, relative, childLevels, childFilter }) {
  const itemFilter = childFilter || itemIsNonEmpty
  const items = sortItemsByImportance((item.items || []).filter(itemFilter))
  const showAsLink = item.hasContents || item.items?.length > 0
  const LinkComponent = unstyled ? UnstyledLink : Link

  return (
    <>
      {showAsLink
        ? <LinkComponent
              style={linkStyle}
              to={item.path}
              relative={relative}>
            {item.title}
          </LinkComponent>
        : <span>
            {item.title}
          </span>}

      {(childLevels === undefined || childLevels > 0) && items.length > 0
        ? <ul>
            {items.map(p =>
              <li key={p.path}>
                <NavItem
                  item={p}
                  linkStyle={linkStyle}
                  unstyled={unstyled}
                  relative={relative}
                  childFilter={childFilter}
                  childLevels={childLevels !== undefined
                    ? childLevels - 1
                    : undefined} />
              </li>
            )}
          </ul>
        : null}
    </>
  )
}


export default NavItem
