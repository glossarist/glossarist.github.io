import React from 'react'
import styled from 'styled-components'

import Page from 'containers/Page'
import { Button, UnstyledLink } from 'components/linksButtons'
import { Lead } from 'components/typography'
import { EntryPoints, EntryPoint, Audience } from 'components/entryPoints'
import { Section } from 'components/RowSection'
import isoSymbol from 'assets/iso-symbol.svg'


const Home: React.FC<{}> = function () {
  return (
    <Page>
      <Lead>
        <p style={{ textAlign: 'center' }}>
          Open-source&nbsp;software
          for&nbsp;maintaining multi-language concept&nbsp;systems.
        </p>
        <EntryPoints fill>
          <EntryPoint>
            <Audience>Managing concept registries with&nbsp;Glossarist?</Audience>
            <Button to="desktop">Use the desktop&nbsp;application</Button>
          </EntryPoint>
          <EntryPoint>
            <Audience>Not using Glossarist in&nbsp;your&nbsp;organization&nbsp;yet?</Audience>
            <Button disabled to="adopt">Learn how to&nbsp;adopt&nbsp;Glossarist</Button>
          </EntryPoint>
          <EntryPoint style={{ flex: 0.5 }}>
            <Audience>Operating infrastructure?</Audience>
            <Button disabled to="desktop">Read the docs</Button>
          </EntryPoint>
        </EntryPoints>
      </Lead>

      <Section title={<>Used&nbsp;by</>} style={{ marginTop: '2rem', opacity: .5 }}>
        <Users>
          <li>
            <img src={isoSymbol} />
            <UnstyledLink to="https://isotc211.geolexica.org/">
              Geolexica for ISO/TC&nbsp;211&nbsp;MLGT
            </UnstyledLink>
          </li>
        </Users>
      </Section>
    </Page>
  )
}

export default Home


const Users = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  > * {
    display: block;
    margin: 1rem 0;
    padding-left: 2.5em;
    position: relative;
    line-height: 1;

    a:link, a:visited {
      color: inherit;
      text-decoration: none;
    }
    > img:first-child {
      vertical-align: middle;
      height: 2em;
      top: -.5em;
      left: 0;
      position: absolute;
    }
  }
`
