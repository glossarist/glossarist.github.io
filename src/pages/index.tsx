import React from 'react'
import { default as Page } from 'containers/Page'
import { Button, Link } from 'components/Links'
import { Lead } from 'components/typography'
import { EntryPoints, EntryPoint, Audience } from 'components/entryPoints'
import styled from 'styled-components'
import isoSymbol from 'assets/iso-symbol.svg'


const Home: React.FC<{}> = function () {
  return (
    <Page>
      <Lead>
        <p>
          Open-source software suite
          for maintaining multi-language concept systems.
        </p>
        <EntryPoints fill>
          <EntryPoint>
            <Audience>Managing concept registries with&nbsp;Glossarist?</Audience>
            <Button className="action" to="desktop">Learn to&nbsp;use the desktop&nbsp;app</Button>
          </EntryPoint>
          <EntryPoint>
            <Audience>Not using Glossarist in&nbsp;your&nbsp;organization&nbsp;yet?</Audience>
            <Button disabled className="action" to="adopt">Learn how to&nbsp;adopt&nbsp;Glossarist</Button>
          </EntryPoint>
          <EntryPoint style={{ flex: 0.5 }}>
            <Audience>Operating infrastructure?</Audience>
            <Button disabled className="action" to="desktop">Read the docs</Button>
          </EntryPoint>
        </EntryPoints>
      </Lead>

      <Section title="Used by" style={{ marginTop: '2rem', opacity: .5 }}>
        <Users>
          <li>
            <img src={isoSymbol} />
            <Link to="https://isotc211.geolexica.org/">
              Geolexica for ISO/TC 211 MLGT
            </Link>
          </li>
        </Users>
      </Section>
    </Page>
  )
}

export default Home


const Section: React.FC<{
  title: string
  style?: React.CSSProperties
  className?: string
}> = function ({ title, style, className, children }) {
  return (
    <RowSection style={style} className={className}>
      <h4 className="title">{title}</h4>
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

  .title {
    text-transform: uppercase;
    font-weight: normal;
    margin: 1em 0;
    padding: 0;
    margin-right: 1rem;
  }
`


const Users = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  > * {
    display: block;
    margin: 1em 0;
    padding-left: 2.5em;
    position: relative;

    a:link, a:visited {
      color: inherit;
      text-decoration: none;
    }
    > img:first-child {
      vertical-align: middle;
      height: 2em;
      top: -.35em;
      left: 0;
      position: absolute;
    }
  }
`
