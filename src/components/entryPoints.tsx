import styled from 'styled-components'


interface EntryPointsProps {
  fill?: boolean
}


export const EntryPoints: React.FC<EntryPointsProps> = styled.div`
  > * + * {
    margin-top: .5rem;
  }

  @media screen and (min-width: 800px) {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;

    > * {
      ${(props: EntryPointsProps) => props.fill ? 'flex: 1' : ''}
    }

    > * + * {
      margin-top: 0;
      margin-left: 1rem;
    }
  }
`


export const EntryPoint = styled.div`
  display: flex;
  flex-flow: column nowrap;

  @media screen and (min-width: 800px) {
    align-items: stretch;
  }

  .action {
    white-space: nowrap;
  }
`


export const Audience = styled.p`
  font-size: 80%;
  color: grey;
  padding-right: 2rem;
`
