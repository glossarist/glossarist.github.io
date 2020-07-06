import React from 'react'
import styled from 'styled-components';
import { Link } from '@reach/router'

import symbolImage from 'assets/Symbol.svg';


export const Logo: React.FC<{ size: number }> = function ({ size }) {
  return (
    <LogoWrapper to="/">
      <SymbolImage size={size} src={symbolImage} className="symbol" />
      <TextWrapper size={size}>Glossarist</TextWrapper>
    </LogoWrapper>
  )
}


export const SymbolImage = styled.img`
  height: ${(props: { size: number }) => props.size * 2}px;
  max-height: 100%;
`

const TextWrapper = styled.h1`
  font-size: ${(props: { size: number }) => props.size * 0.88}px;

  font-family: LoraRegular, Georgia, serif;
  letter-spacing: -.020em;

  margin: 0;
  padding: 0;

  margin-left: .5rem;

  @supports (font-variation-settings: 'wdth' 400) {
    font-family: Lora, Georgia, serif;
    font-variation-settings: 'wght' 400;
  }
`

const LogoWrapper = styled(Link)`
  color: inherit;
  text-decoration: none;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  padding: 1rem;

  margin-left: -32px;
`
