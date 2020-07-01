import React from 'react'
import styled from 'styled-components'

import * as theme from '../theme/colors'
import asciidocBaseCSS from '!!raw-loader!../assets/css/asciidoctor.css'


export const Asciidoc: React.FC<{ className?: string, content: string }> =
function ({ className, content }) {
  return <AsciidocStyled
    className={className}
    dangerouslySetInnerHTML={{ __html: content }} />
}


const AsciidocStyled = styled.div`
  ${asciidocBaseCSS}

  a, a:link, a:visited {
    color: ${theme.scale[0].darken(1).css()};
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
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: whiteSmoke;

    .content {
      text-align: center;
    }
  }
`