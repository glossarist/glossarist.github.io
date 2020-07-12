import React from 'react'
import { Link as RouterLink, useLocation } from '@reach/router'
import { useRoutePath } from 'react-static'
import styled from 'styled-components'
import { buttonStyle, disabledButtonStyle, enabledButtonStyle } from './buttons'


interface LinkProps {
  to: string
  className?: string
  disabled?: boolean
  relative?: string | boolean
  title?: string
}
export const Link: React.FC<LinkProps> =
function ({ to, title, className, disabled, children, relative }) {
  const loc = useLocation().pathname
  const hasAnchor = to.indexOf('#') >= 0
  const routePath = (useRoutePath as () => string)()

  if (to?.startsWith('http') || disabled) {
    return (
      <a
          title={title}
          className={className}
          href={disabled ? undefined : to}>
        {children}
      </a>
    );

  } else {
    const _relative = relative === undefined ? to.indexOf('/') !== 0 : relative
    const locWithoutSlashes = loc.replace(/^\/|\/$/g, '')
    const prefix = _relative === true
      ? `/${locWithoutSlashes}${locWithoutSlashes !== '' ? '/' : ''}`
      : (_relative || '/');
    const trailingSlash = hasAnchor ? false : true;
    const _to = `${prefix}${to.replace(/^\/|\/$/g, '')}${trailingSlash ? '/' : ''}`
    const isActive = `/${routePath}/` === _to

    return (
      <InternalLink
          title={title}
          className={className}
          style={{
            fontWeight: isActive ? 'bold' : undefined,
            color: isActive ? 'black' : undefined,
            cursor: isActive ? 'default' : undefined,
          }}
          to={_to}>
        {children}
      </InternalLink>
    );
  }
}


const InternalLink = styled(RouterLink)`
  &[aria-current=page] {
    font-weight: bold;
    text-decoration: none;
    color: inherit;
    cursor: default;
  }
`


export const Button = styled(Link)`
  ${buttonStyle}

  ${(props: { disabled?: boolean }) => props.disabled
    ? disabledButtonStyle
    : enabledButtonStyle}
`

export const Backlink: React.FC<{ className?: string }> = function ({ className }) {
  return <Link className={className} to="..">&larr; Back</Link>
}
