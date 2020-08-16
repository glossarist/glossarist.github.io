import React from 'react'
import styled, { css } from 'styled-components'
import { Link } from '@reach/router'

import symbolImage from 'assets/Symbol.svg'


interface LogoProps {
  size: number
  title: string
  linkTo?: string
}
const Logo: React.FC<LogoProps> = function ({ size, title, linkTo }) {
  return (
    <LogoWrapper to={linkTo || "/"}>
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
  height: ${(props: { size: number }) => css`${props.size * 1.75}px`};
  max-height: 100%;
  margin: 1rem 0;
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

  font-size: 1.7rem;
  font-weight: 400;

  @media screen and (min-width: 800px) {
    text-align: left;
    font-size: ${(props: { size: number }) => css`${props.size * 0.90}px`};
  }
`

const LogoWrapper = styled(Link)`
  color: inherit;
  border-bottom: none;

  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;

  padding: 1rem;

  @media screen and (min-width: 800px) {
    flex-flow: row nowrap;
  }
`
