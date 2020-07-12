import styled from 'styled-components'
import * as theme from '../theme/colors'


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

export const Button = styled.button`
  ${buttonStyle}

  ${(props: { disabled?: boolean }) => props.disabled
    ? disabledButtonStyle
    : enabledButtonStyle}
`
