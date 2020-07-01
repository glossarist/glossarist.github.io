import React, { useEffect, useState } from 'react'
import { Button } from 'components/Links'
import { PageTitle, Lead } from 'components/typography'
import { Octokit } from '@octokit/rest'
import { EntryPoints, EntryPoint } from 'components/entryPoints';


const octokit = new Octokit()

const repoOwner = 'glossarist'
const repoName = 'glossarist-desktop'


export default () => {
  const [releaseName, setReleaseName] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const release = await octokit.repos.getLatestRelease({
        owner: 'glossarist',
        repo: 'glossarist-desktop',
      });

      setReleaseName(release.data.name);
    })()
  }, [])

  const dlMac = `https://github.com/${repoOwner}/${repoName}/releases/download/v${releaseName}/glossarist-desktop-${releaseName}.dmg`
  const dlWin = `https://github.com/${repoOwner}/${repoName}/releases/download/v${releaseName}/install-glossarist-desktop-${releaseName}.exe`

  return (
    <div>
      <PageTitle>Glossarist Desktop</PageTitle>
      <Lead>
        <p>
          Manage your concept system from an app that runs on your computer.
        </p>
      </Lead>

      <h3>Download{releaseName ? ` v${releaseName}` : null}</h3>
      <EntryPoints>
        <EntryPoint>
          <Button to={dlMac}>macOS</Button>
        </EntryPoint>
        <EntryPoint>
          <Button to={dlWin}>Windows</Button>
        </EntryPoint>
      </EntryPoints>

      <h3>Learn</h3>
      <EntryPoints>
        <EntryPoint>
          <Button to="docs/guides" disabled>Get started</Button>
        </EntryPoint>
        <EntryPoint>
          <Button to="docs/ui">Read UI reference</Button>
        </EntryPoint>
        <EntryPoint>
          <Button to={`https://github.com/${repoOwner}/${repoName}/`}>Visit GitHub</Button>
        </EntryPoint>
      </EntryPoints>

    </div>
  )
}
