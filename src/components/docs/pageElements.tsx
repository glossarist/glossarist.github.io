import styled from 'styled-components'
import { Lead as BasicLead } from '../typography'
import chroma from 'chroma-js'


export const SIDEBAR_WIDTH_REM = 16
export const SIDEBAR_BACKGROUND = 'whiteSmoke'
export const SIDEBAR_BORDER = `${chroma('whiteSmoke').darken(0.4).css()} 1px solid`
export const HEADER_HEIGHT_REM = 8


export const Lead = styled(BasicLead)`
  margin-bottom: 2rem;
`


export const GlobalNav = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-size: 85%;

  @media screen and (min-width: 800px) {
    margin-top: 0;
    display: block;

    width: ${SIDEBAR_WIDTH_REM}rem;
    position: fixed;
    top: ${HEADER_HEIGHT_REM}rem;
    left: 0;
    bottom: 0;
    padding-left: 2rem;
    padding-right: 1rem;

    overflow-y: auto;
    overflow-x: hidden;

    background: ${SIDEBAR_BACKGROUND};
    border-right: ${SIDEBAR_BORDER};
  }
`


export const Main = styled.main`
  padding-bottom: 1rem;

  > .blocks {
    article + article {
      margin-top: 1rem;
      border-top: 1px solid silver;
    }
  }

  @media screen and (min-width: 800px) {
    padding-top: 1rem;
    max-width: 50rem;

    h2 {
      margin-top: 0;
    }
  }
`


export const NavItemList = styled.ul`
  &, ul {
    list-style: none;
    padding-left: 0;
  }

  li ul {
    padding-left: 1.2rem;
  }

  li {
    margin-top: .5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`
