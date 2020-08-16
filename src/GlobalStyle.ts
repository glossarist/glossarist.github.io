import { createGlobalStyle } from 'styled-components'

import sFont from 'assets/fonts/Lora-Regular.ttf'

import * as theme from './theme/colors'


export const pageContainerSelector = 'body > #root > :first-child > :first-child'
// If a subsection of the site needs to redefine
// style of page wrapper (immediate descendant of the router),
// its container should create a global style and add extra rules
// inside this selector.


export default createGlobalStyle`
  @font-face {
    font-family: LoraRegular;
    src: url('${sFont}');
    font-weight: normal;
    font-style: normal;
  }

  * {
    scroll-behavior: smooth;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 17px;
    font-weight: 300;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;

    height: 100vh;

    display: flex;
    flex-flow: column nowrap;
  }

  @media screen and (min-width: 800px) {
    body, body > #root, body > #root > :first-child {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
    }
  }

  ${pageContainerSelector} {
    margin-left: 1rem;
    margin-right: 1rem;

    @media screen and (min-width: 800px) {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;

      margin-left: 10vw;
      margin-right: 10vw;
      align-self: center;
      align-items: stretch;
      justify-content: center;
    }
  }

  p {
    font-size: 100%;
    line-height: 1.5;
  }

  a {
    color: ${theme.link.css()};
    text-decoration: none;
  }

  :global .svg-inline--fa {
    height: 1em;
    width: 1em;
  }

  img {
    max-width: 100%;
  }
`
