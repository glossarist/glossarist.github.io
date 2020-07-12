import React from 'react'
import styled from 'styled-components'


interface EntryPointsProps {
  fill?: boolean
  labelPosition?: 'top' | 'bottom'
}


export const EntryPoints: React.FC<EntryPointsProps & {
  style?: React.CSSProperties
  className?: string
}> =
styled.div`
  > * {
    margin-top: 1rem;
  }

  text-align: center;

  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;

  > * > :not(a):not(button) {
    ${(props: EntryPointsProps) => props.labelPosition !== 'bottom'
      ? 'margin-bottom'
      : 'margin-top'}: .8rem;
  }

  @media screen and (min-width: 800px) {
    text-align: left;

    display: flex;
    flex-flow: row nowrap;

    align-items: ${(props: EntryPointsProps) => props.labelPosition !== 'bottom'
      ? 'flex-end'
      : 'flex-start'};

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
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;

  > a, > button {
    white-space: nowrap;
  }
`


export const Label = styled.div`
  font-size: 80%;
  color: grey;
  margin: 0;
  margin-left: .1rem;

  @media screen and (min-width: 800px) {
    padding-right: 2rem;
  }
`


export const Audience = styled(Label)`
`
