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
    font-size: .95em;
    line-height: 1.7;
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

  @media screen and (max-width: 800px) {
    .admonitionblock {
      > table > tbody > tr {
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
      }
    }
  }

  .imageblock, .admonitionblock, .listingblock {
    margin-top: 1em;
  }

  .listingblock {
    @media screen and (max-width: 800px) {
      margin-left: -1rem;
      margin-right: -1rem;

      > .content > pre {
        padding-left: 1rem;
      }
    }
  }


  // List item spacing

  p, ol > li p, ul > li p {
    margin-bottom: 0;
  }


  // Paragraph indentation

  p + p {
    text-indent: 1.5em;
  }

  .paragraph + .paragraph {
    p {
      text-indent: 1.5em;
    }
  }


  // Image dimensions

  @media screen and (min-width: 800px) {
    img {
      max-width: 50vw;
      max-height: 50vh;
    }
    .imageblock.unbounded-image img {
      max-width: 100%;
      max-height: unset;
    }
  }

  .imageblock {
    padding: 1.2rem;
    background: whiteSmoke;

    .content {
      text-align: center;
    }

    img {
      box-shadow: rgba(0, 0, 0, 0.15) .1rem .1rem 1rem;
    }

    &.unbounded-image {
      padding: unset;
      background: unset;

      img {
        box-shadow: unset;
      }
    }
  }
`
