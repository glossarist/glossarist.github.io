import React from 'react'
import { Button } from 'components/Links'
import { Lead } from 'components/typography'
import { EntryPoints, EntryPoint, Audience } from '../components/entryPoints'


const Page: React.FC<{}> = function () {
  return (
    <div>
      <Lead>
        <p>
          Open-source software suite
          for maintaining multi-language concept systems.
        </p>
        <EntryPoints fill>
          <EntryPoint>
            <Audience>Not using Glossarist in&nbsp;your&nbsp;organization&nbsp;yet?</Audience>
            <Button disabled className="action" to="adopt">Learn how to&nbsp;adopt&nbsp;Glossarist</Button>
          </EntryPoint>
          <EntryPoint>
            <Audience>Managing concept registries with&nbsp;Glossarist?</Audience>
            <Button className="action" to="desktop">Learn desktop&nbsp;app</Button>
          </EntryPoint>
          <EntryPoint>
            <Audience>Operating infrastructure?</Audience>
            <Button disabled className="action" to="desktop">Read the docs</Button>
          </EntryPoint>
        </EntryPoints>
      </Lead>
    </div>
  )
}

export default Page