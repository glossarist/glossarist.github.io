import React from 'react'
import styled, { css } from 'styled-components'

import * as theme from '../theme/colors'
import asciidocBaseCSS from '!!raw-loader!../assets/css/asciidoctor.css'


const Asciidoc:
React.FC<{
  content: string
  inline?: boolean
  className?: string
  style?: React.CSSProperties
}> =
function ({ content, inline, className, style }) {
  if (inline) {
    return <AsciidocStyledInline
      style={style}
      className={className}
      dangerouslySetInnerHTML={{ __html: content }} />
  } else {
    return <AsciidocStyled
      style={style}
      className={className}
      dangerouslySetInnerHTML={{ __html: content }} />
  }
}


export default Asciidoc


const asciidocBase = css`
  ${asciidocBaseCSS}

  &, p {
    font-size: 100%;
    line-height: 1.6;
    font-weight: 300;
  }

  a, a:link, a:visited {
    color: ${theme.scale[0].darken(1).css()};
  }
`

const AsciidocStyledInline = styled.p`
  ${asciidocBase}
`

const AsciidocStyled = styled.div`
  ${asciidocBase}

  .admonitionblock .content {
    margin-bottom: 1em;
    font-size: inherit;
  }

  p, ol > li p, ul > li p {
    margin-bottom: 0;
  }

  p + p {
    text-indent: 1.5em;
  }

  .imageblock, .admonitionblock {
    margin-top: 1em;
  }

  .paragraph + .paragraph {
    p {
      text-indent: 1.5em;
    }
  }

  @media screen and (min-width: 800px) {
    img {
      max-width: 50vw;
      max-height: 50vh;
    }
  }

  img {
    box-shadow: rgba(0, 0, 0, 0.15) .1rem .1rem 1rem;
  }
  .imageblock {
    padding: 1.2rem;
    background: whiteSmoke;

    .content {
      text-align: center;
    }
  }
`
