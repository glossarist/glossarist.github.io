import React from 'react'
import { Link as RouterLink, useLocation } from '@reach/router'
import styled from 'styled-components'
import * as theme from '../theme/colors'


interface LinkProps {
  to: string
  className?: string
  disabled?: boolean
  relative?: string | boolean
}
export const Link: React.FC<LinkProps> =
function ({ to, className, disabled, children, relative }) {
  const loc = useLocation().pathname
  const hasAnchor = to.indexOf('#') >= 0

  if (to?.startsWith('http') || disabled) {
    return <a className={className} href={disabled ? undefined : to}>{children}</a>;

  } else {
    const _relative = relative === undefined ? true : relative
    const locWithoutSlashes = loc.replace(/^\/|\/$/g, '')
    const prefix = _relative === true
      ? `/${locWithoutSlashes}${locWithoutSlashes !== '' ? '/' : ''}`
      : (_relative || '/');
    const trailingSlash = hasAnchor ? false : true;
    const _to = `${prefix}${to.replace(/^\/|\/$/g, '')}${trailingSlash ? '/' : ''}`

    return (
      <InternalLink
          className={className}
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


const buttonStyle = `
  padding: .5em .75em;
  color: white;
  text-decoration: none;

  & + & {
    margin-left: .5rem;
  }
`


export const Button = styled(Link)`
  ${buttonStyle}

  background: ${theme.link.css()};

  ${(props: LinkProps) => props.disabled && `
    cursor: not-allowed;
    background: silver;
  `}
`


export const Backlink: React.FC<{ className?: string }> = function ({ className }) {
  return <Link className={className} to="..">&larr; Back</Link>
}