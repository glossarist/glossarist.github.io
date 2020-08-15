import styled from 'styled-components'
import { Lead as BasicLead } from '../typography'
import chroma from 'chroma-js'


export const SIDEBAR_WIDTH_REM = 16
export const SIDEBAR_BACKGROUND = 'whiteSmoke'
export const SIDEBAR_BORDER = `${chroma('whiteSmoke').darken(0.4).css()} 1px solid`
export const HEADER_HEIGHT_REM = 4


export const Lead = styled(BasicLead)`
  margin-bottom: 2rem;
`


export const PageToC = styled.nav`
  background: ${SIDEBAR_BACKGROUND};
  margin: 0 -2rem;
  margin-bottom: 1rem;
  padding: .25rem 2rem;

  > .header {
    font-size: 90%;
  }
`


export const GlobalNav = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-size: 80%;

  @media screen and (min-width: 800px) {
    margin-top: 0;
    display: block;

    width: ${SIDEBAR_WIDTH_REM}rem;
    position: fixed;
    top: ${HEADER_HEIGHT_REM}rem;
    left: 0;
    bottom: 0;
    padding-left: .5rem;

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


export const GlobalNavItemList = styled.ul`
  list-style: none;
  padding-left: 0;

  li {
    padding-left: 1.2rem;
    padding-top: .25rem;
    line-height: 1.5;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    > ul {
      border-left: ${SIDEBAR_BORDER};
    }
  }
`


export const GlobalNavTopLevelItemList = styled(GlobalNavItemList)`
  > li {
    border-left-width: 0;

    padding-top: .5rem;
    padding-bottom: .5rem;
    border-bottom: ${SIDEBAR_BORDER};

    &:first-child {
      border-top: ${SIDEBAR_BORDER};
    }

    > span, > a, > strong {
      text-transform: uppercase;
      letter-spacing: .02em;
      font-size: 90%;
      margin-bottom: .5rem;
    }
  }
`


export const ToCItemList = styled.ul`
  margin: 0;
  margin-top: 1rem;

  font-size: 90%;
  line-height: 1.5;

  display: flex;
  padding: 0 0 1rem 0;
  list-style: none;
  overflow-x: auto;

  > * + * {
    margin-left: .5rem;

    &:before {
      content: "•";
      margin-right: .5rem;
    }
  }

  > * {
    white-space: nowrap;
    font-size: 90%;
    color: grey;
  }
`
