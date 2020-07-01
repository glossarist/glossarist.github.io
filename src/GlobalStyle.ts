import { createGlobalStyle } from 'styled-components'

import vFont from 'assets/fonts/Lora.ttf'
import sFont from 'assets/fonts/Lora-Regular.ttf'

import * as theme from './theme/colors'


export const app = 'body > #root > :first-child'


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

    body, body > #root, ${app} {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
    }
    ${app} {
      margin-left: 10vw;
      margin-right: 10vw;
    }
  }

  ${app} > header {
    align-self: stretch;
  }

  ${app} > main {
    flex: 1;
    overflow-y: auto;
  }

  ${app} > footer {
    flex-shrink: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    padding: 1.5rem 2rem;
    opacity: .5;

    &:hover {
      opacity: 1;
    }
  }

  a {
    color: ${theme.link.css()};
  }

  img {
    max-width: 100%;
  }
`
