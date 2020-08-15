import React from 'react'
import styled from 'styled-components'

import * as theme from '../theme/colors'
import asciidocBaseCSS from '!!raw-loader!../assets/css/asciidoctor.css'


const Asciidoc:
React.FC<{ className?: string, style?: React.CSSProperties, content: string }> =
function ({ className, style, content }) {
  return <AsciidocStyled
    style={style}
    className={className}
    dangerouslySetInnerHTML={{ __html: content }} />
}


export default Asciidoc


const AsciidocStyled = styled.div`
  ${asciidocBaseCSS}

  font-size: 100%;
  line-height: 1.5;

  a, a:link, a:visited {
    color: ${theme.scale[0].darken(1).css()};
  }

  p, .admonitionblock .content {
    margin-bottom: 1rem;
    font-size: inherit;
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
