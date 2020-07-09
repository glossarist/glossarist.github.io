import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { default as Page } from 'containers/Page'
import { Button } from 'components/Links'
import { Lead } from 'components/typography'
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

  let dlMac: string | undefined
  let dlWinPort: string | undefined
  const dlDefault = `https://github.com/${repoOwner}/${repoName}/releases/`

  if (releaseName) {
    dlMac = `https://github.com/${repoOwner}/${repoName}/releases/download/v${releaseName}/glossarist-desktop-${releaseName}.dmg`
    dlWinPort = `https://github.com/${repoOwner}/${repoName}/releases/download/v${releaseName}/glossarist-desktop-${releaseName}-portable.exe`
  } else {
    dlMac = undefined
    dlWinPort = undefined
  }

  return (
    <Page title="Glossarist Desktop">

      <Helmet>
        <title>Glossarist Desktop application</title>
      </Helmet>

      <Lead>
        <p>
          Manage a concept system from an app that runs on your computer.
        </p>
        <br />
        <Button to="docs/getting-started">Get started</Button>
      </Lead>

      <br />

      <h3>Download{releaseName ? ` latest release (v${releaseName})` : null}</h3>

      <EntryPoints>
        {!dlMac || !dlWinPort
          ? <EntryPoint>
              <Button to={dlDefault}>Latest release</Button>
            </EntryPoint>
          : null}
        {dlMac
          ? <EntryPoint>
              <Button to={dlMac}>macOS</Button>
            </EntryPoint>
          : null}
        {dlWinPort
          ? <EntryPoint>
              <Button to={dlWinPort}>Windows</Button>
            </EntryPoint>
          : null}
      </EntryPoints>

    </Page>
  )
}
