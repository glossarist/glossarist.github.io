import React from 'react'
import { Link as RouterLink, useLocation } from '@reach/router'
import { useRoutePath } from 'react-static'
import styled from 'styled-components'
import * as theme from '../theme/colors'


interface LinkProps {
  to: string
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  relative?: string | boolean
  title?: string
}
export const Link: React.FC<LinkProps> =
function ({ to, title, style, className, disabled, children, relative }) {
  const loc = useLocation().pathname
  const hasAnchor = to.indexOf('#') >= 0
  const routePath = (useRoutePath as () => string)()

  if (to?.startsWith('http') || disabled) {
    return (
      <a
          title={title}
          className={className}
          style={style}
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
            ...(style || {}),
            fontWeight: isActive ? 'bold' : (style?.fontWeight || undefined),
            color: isActive ? 'black' : (style?.color || undefined),
            cursor: isActive ? 'default' : (style?.cursor || undefined),
          }}
          to={_to}>
        {children}
      </InternalLink>
    );
  }
}


export const Backlink: React.FC<{ className?: string }> = function ({ className }) {
  return <Link className={className} to="..">&larr; Back</Link>
}


export const disabledButtonStyle = `
  cursor: not-allowed;
  background: silver;
`

export const enabledButtonStyle = `
  text-shadow: rgba(0, 0, 0, 0.4) .05rem .05rem .1rem;
  box-shadow:
    ${theme.link.darken(.5).css()} 0 0 0rem .1rem inset,
    rgba(255, 255, 255, 0.3) .1rem .4rem .7em -.2em inset;

  &:hover, &:active, &:focus {
    background-position: 100% 100%;
    text-shadow: rgba(0, 0, 0, 0.2) .05rem .05rem .25rem;
    box-shadow:
      ${theme.link.darken(.5).css()} 0 0 0rem .1rem inset,
      rgba(255, 255, 255, 0) .1rem .4rem 1rem inset;
  }
`

export const buttonStyle = `
  border: none;
  padding: .5em 1rem;
  color: white;
  text-decoration: none;
  border-radius: .25rem;

  & + & {
    margin-left: .5rem;
  }

  background: linear-gradient(
    135deg,
    ${theme.link.brighten(.5).desaturate(.25).css()} 50%,
    ${theme.link.darken(.5).css()} 50%);

  transition: box-shadow .1s linear, text-shadow .1s linear, background-position .1s linear;
  background-size: 200% 200%;
  background-position: 0% 30%;
`


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
