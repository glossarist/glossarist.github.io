import React from 'react'
import styled from 'styled-components'


export const Section: React.FC<{
  title: JSX.Element | string
  subtitle?: JSX.Element | string
  style?: React.CSSProperties
  className?: string
}> = function ({ title, subtitle, style, className, children }) {
  return (
    <RowSection style={style} className={className}>
      <header>
        <h4 className="title">{title}</h4>
        {subtitle ? <div className="subtitle">{subtitle}</div> : null}
      </header>
      <div className="contents">{children}</div>
    </RowSection>
  )
}

const RowSection = styled.section`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  justify-content: center;

  @media screen and (min-width: 800px) {
    justify-content: flex-start;
  }

  & + & {
    margin-top: 1rem;
  }

  > header {
    margin: 1rem 0;
    margin-right: 1rem;

    .title, .subtitle {
      margin: 0;
      font-size: 1rem;
      font-weight: normal;
    }
    .title {
      text-transform: uppercase;
      padding: 0;
      line-height: 1;
    }
    .subtitle {
      margin-top: .5rem;
      color: grey;
    }
  }
`
