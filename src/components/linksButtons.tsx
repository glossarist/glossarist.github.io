import React from 'react'
import { Link as RouterLink, useLocation } from '@reach/router'
import { useRoutePath } from 'react-static'
import styled from 'styled-components'
import * as theme from '../theme/colors'


const LINK_BORDER = `1px dotted ${theme.link.css()}`


function withoutTrailingSlashes(path: string): string {
  return path.replace(/^\/|\/$/g, '')
}


export function useNormalizedInternalHRef(to: string, relative?: string | boolean): string {
  const loc = useLocation().pathname

  const hasAnchor = to.indexOf('#') >= 0
  const trailingSlash = hasAnchor ? false : true

  const _relative = relative === undefined ? to.indexOf('/') !== 0 : relative
  const locWithoutSlashes = withoutTrailingSlashes(loc)
  const prefix = _relative === true
    ? `/${locWithoutSlashes}${locWithoutSlashes !== '' ? '/' : ''}`
    : (_relative || '/')

  return `${prefix}${withoutTrailingSlashes(to)}${trailingSlash ? '/' : ''}`
}


export function useInternalLinkCurrentState(normalizedPath: string): boolean {
  const routePath = (useRoutePath as () => string)()

  return `/${routePath}/` === normalizedPath
}


export interface LinkProps {
  to: string
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  relative?: string | boolean
  title?: string
}
export const Link: React.FC<LinkProps> =
function ({ to, title, style, className, disabled, children, relative }) {
  const _to = useNormalizedInternalHRef(to, relative)
  const isActive = useInternalLinkCurrentState(_to)

  if (to?.startsWith('http') || disabled) {
    return (
      <a
          title={title}
          className={className}
          style={style}
          href={disabled ? undefined : to}>
        {children}
      </a>
    )

  } else {

    return (
      <InternalLink
          title={title}
          className={className}
          aria-current={isActive ? 'page' : undefined}
          style={style}
          to={_to}>
        {children}
      </InternalLink>
    )
  }
}


export const Backlink: React.FC<{ className?: string }> = function ({ className }) {
  return <UnstyledLink className={className} to="..">&larr; Back</UnstyledLink>
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
  border-radius: .25rem;
  padding: .5em 1rem;
  color: white;
  font-weight: 400;

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
  border-bottom: ${LINK_BORDER};
  text-decoration: none;

  &:hover {
    border-bottom-style: solid;
  }

  &[aria-current=page] {
    border-bottom: none;
    text-decoration: none;
    color: inherit;
    cursor: default;
  }
  &[aria-current=page]:hover {
    border-bottom: none;
    text-decoration: none;
  }
`


export const UnstyledLink = styled(Link)`
  border-bottom: none;
  color: inherit;

  &:hover {
    border-bottom: none;
    text-decoration: underline;
  }
`


export const Button = styled(UnstyledLink)`
  ${buttonStyle}

  &:hover {
    text-decoration: none;
  }

  ${(props: { disabled?: boolean }) => props.disabled
    ? disabledButtonStyle
    : enabledButtonStyle}
`
