import { createGlobalStyle } from 'styled-components'

import vFont from 'assets/fonts/Lora.ttf'
import sFont from 'assets/fonts/Lora-Regular.ttf'

import * as theme from './theme/colors'


export const app = 'body > #root > :first-child > :first-child'


export default createGlobalStyle`
  @font-face {
    font-family: LoraRegular;
    src: url('${sFont}');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: Lora;
    src: url('${vFont}');
    font-weight: 400;
    font-style: normal;
  }

  * {
    scroll-behavior: smooth;
    box-sizing: border-box;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, 'Lucida Grande', Arial, sans-serif;
    font-size: 16px;
    margin: 0;
    padding: 0;

    height: 100vh;

    display: flex;
    flex-flow: column nowrap;
  }

  ${app} {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  @media screen and (min-width: 800px) {
    body, body > #root, body > #root > :first-child, ${app} {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
    }
    ${app} {
      margin-left: 10vw;
      margin-right: 10vw;
      align-self: center;
      align-items: stretch;
      justify-content: center;
    }
  }

  ${app} > footer {
    flex-shrink: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    padding: 1.5rem 0;
    opacity: .5;

    &:hover {
      opacity: 1;
    }

    @media screen and (min-width: 800px) {
      justify-content: flex-end;
    }
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
