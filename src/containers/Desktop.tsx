import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { Octokit } from '@octokit/rest'
import { ReposGetLatestReleaseResponseData } from '@octokit/types'

import { default as Page } from 'containers/Page'
import { Button } from 'components/Links'
import { Lead } from 'components/typography'
import { EntryPoints, EntryPoint } from 'components/entryPoints'


const octokit = new Octokit()


const repoOwner = 'glossarist'
const repoName = 'glossarist-desktop'


type OS = 'macOS' | 'Windows'


function getGithubLink(
  githubRepoOwner: string,
  githubRepoName: string,
): string {
  return `https://github.com/${githubRepoOwner}/${githubRepoName}`
}


export default () => {
  const [releaseData, setReleaseData] =
    useState<ReposGetLatestReleaseResponseData | undefined>(undefined);

  const [userOS, setUserOS] =
    useState<OS | undefined>(undefined)

  const [specificDLLink, setSpecificDLLink] =
    useState<string | undefined>(undefined);

  const releaseName = releaseData?.name

  useEffect(() => {
    (async () => {
      const release = await octokit.repos.getLatestRelease({
        owner: repoOwner,
        repo: repoName,
      })
      setReleaseData(release.data);
    })()
  }, [])

  useEffect(() => {
    if (userOS && releaseName) {
      const assets = releaseData.assets

      let expectedOSAssetName: string
      if (userOS === 'Windows') {
        expectedOSAssetName = `glossarist-desktop-${releaseName}-portable.exe`
      } else if (userOS === 'macOS') {
        expectedOSAssetName = `glossarist-desktop-${releaseName}.dmg`
      }

      const asset = assets.find(a => a.name === expectedOSAssetName)

      if (asset && asset.browser_download_url) {
        setSpecificDLLink(asset.browser_download_url);
      }
    }
  }, [userOS, releaseData])

  useEffect(() => {
    if (window?.navigator) {
      const ua = window.navigator.userAgent
      if (ua.indexOf('Mac') >= 0) {
        setUserOS('macOS')
      } else if (ua.indexOf('Windows')) {
        setUserOS('Windows')
      }
    }
  }, [])

  const releasesURL = `${getGithubLink(repoOwner, repoName)}/releases`;

  return (
    <Page title="Glossarist Desktop">

      <Helmet>
        <title>Glossarist Desktop application</title>
      </Helmet>

      <Lead>
        <p>
          Manage a concept system from an app that runs on your computer.
        </p>

        <EntryPoints>
          <EntryPoint>
            <Button to="docs/getting-started">Get started</Button>
          </EntryPoint>
          <EntryPoint>

            {userOS && specificDLLink
              ? <Button to={specificDLLink}>
                  Download{releaseName ? ` v${releaseName}` : null} for {userOS}
                </Button>
              : <Button to={releasesURL}>
                  View releases
                </Button>}
          </EntryPoint>
        </EntryPoints>
      </Lead>

    </Page>
  )
}
