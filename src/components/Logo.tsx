import React from 'react'
import styled, { css } from 'styled-components'
import { Link } from '@reach/router'

import symbolImage from 'assets/Symbol.svg'


interface LogoProps {
  size: number
  title: string
  linkTo?: string
  style?: React.CSSProperties
  className?: string
}
const Logo: React.FC<LogoProps> = function ({ size, title, linkTo, style, className }) {
  return (
    <LogoWrapper to={linkTo || "/"} style={style} className={className}>
      <Symbol size={size} />
      <TextWrapper size={size}>{title}</TextWrapper>
    </LogoWrapper>
  )
}


export default Logo


export const Symbol: React.FC<{ size: number }> = function ({ size }) {
  return <SymbolImage
    size={size}
    src={symbolImage}
    className="symbol" />
}


export const SymbolImage = styled.img`
  height: ${(props: { size: number }) => css`${props.size * 1.1}px`};
  max-height: 100%;
  @media screen and (min-width: 800px) {
    margin: 0;
  }
`

const TextWrapper = styled.h1`
  font-family: LoraRegular, Georgia, serif;
  letter-spacing: -.018em;

  margin: 0;
  padding: 0;
  text-align: center;

  font-size: ${(props: { size: number }) => css`${props.size * 0.5}px`};
  font-weight: 400;
`

const LogoWrapper = styled(Link)`
  color: inherit;
  border-bottom: none;

  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;

  @media screen and (min-width: 800px) {
    flex-flow: row nowrap;
  }
`
