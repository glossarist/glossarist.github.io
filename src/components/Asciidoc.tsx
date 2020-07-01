import React from 'react'
import styled from 'styled-components'

import asciidocBaseCSS from '!!raw-loader!../assets/css/asciidoctor.css'


export const Asciidoc: React.FC<{ className?: string, content: string }> =
function ({ className, content }) {
  return <AsciidocStyled
    className={className}
    dangerouslySetInnerHTML={{ __html: content }} />
}


const AsciidocStyled = styled.div`
  ${asciidocBaseCSS}

  img {
    max-width: 50vw;
    max-height: 50vh;
    box-shadow: rgba(0, 0, 0, 0.15) .1rem .1rem 1rem;
  }
  .imageblock {
    padding-left: 2rem;
  }
`