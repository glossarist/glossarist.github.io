import React from 'react'
import styled from 'styled-components'


interface EntryPointsProps {
  fill?: boolean
}


export const EntryPoints:
React.FC<EntryPointsProps & { style?: React.CSSProperties, className?: string }> =
styled.div`
  > * {
    margin-top: 2rem;
  }

  text-align: center;

  @media screen and (min-width: 800px) {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    text-align: left;

    > * {
      ${(props: EntryPointsProps) => props.fill ? 'flex: 1;' : ''}
      margin-top: 0;
    }

    > * + * {
      margin-left: 1rem;
    }
  }
`


export const EntryPoint = styled.div`

  @media screen and (min-width: 800px) {
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
  }

  .action {
    white-space: nowrap;
  }
`


export const Audience = styled.p`
  font-size: 80%;
  color: grey;

  @media screen and (min-width: 800px) {
    padding-right: 2rem;
  }
`
