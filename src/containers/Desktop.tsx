import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteData } from 'react-static'

import moment from 'moment'

import { Octokit } from '@octokit/rest'
import { ReposGetLatestReleaseResponseData } from '@octokit/types'
import { ReposListReleasesResponseData } from '@octokit/types'

import { default as Page } from '../containers/Page'
import { Link, Button } from '../components/linksButtons'
import { Lead } from '../components/typography'
import { EntryPoints, EntryPoint, Label } from '../components/entryPoints'
import styled from 'styled-components'


const repoOwner = 'glossarist'
const repoName = 'glossarist-desktop'

const octokit = new Octokit()

type ReleaseList = (ReposListReleasesResponseData[number] & { bodyHTML: string })[]

type OS = 'macOS' | 'Windows'

function getGithubLink(
  githubRepoOwner: string,
  githubRepoName: string,
): string {
  return `https://github.com/${githubRepoOwner}/${githubRepoName}`
}


export default () => {
  const routeData: { releases: ReleaseList } = useRouteData()

  const [releaseData, setReleaseData] =
    useState<ReposGetLatestReleaseResponseData | undefined>(undefined)

  const [userOS, setUserOS] =
    useState<OS | undefined>(undefined)

  const [specificDLLink, setSpecificDLLink] =
    useState<string | undefined>(undefined);

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
        setSpecificDLLink(asset.browser_download_url)
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

  const releasesURL = `${getGithubLink(repoOwner, repoName)}/releases`

  const releases = routeData.releases

  const releaseName = releaseData?.name

  const releaseDate = releaseData ? moment(releaseData.published_at) : null

  const release = releases[0]

  const releaseNotesAtBuild = release?.bodyHTML?.trim() || ''

  const effectiveReleaseNotes = release.name === releaseName
    ? releaseNotesAtBuild
    : `<p>${releaseData?.body.split('\n')[0] || ''}</p>`
      // TODO: If there was a new release since last build,
      // we naively extract the first paragraph from release notes.
      // It may contain unparsed Markdown inline formatting
      // as we aren’t bringing Markdown parser to client-side yet
      // for performance reasons.

  return (
    <Page title="Glossarist Desktop">

      <Helmet>
        <title>Glossarist Desktop application</title>
      </Helmet>

      <Lead>
        <p style={{ textAlign: 'center' }}>
          Manage a&nbsp;concept&nbsp;system from&nbsp;an&nbsp;app that&nbsp;runs on&nbsp;your&nbsp;computer.
        </p>

        <EntryPoints fill labelPosition="bottom">
          <EntryPoint>
            {userOS && specificDLLink
              ? <Button to={specificDLLink} title={`Download${releaseName ? ` v${releaseName}` : null} for ${userOS}`}>
                  Download for {userOS}
                </Button>
              : <Button to={releasesURL}>
                  Download
                </Button>}
            {specificDLLink && userOS && releaseName
              ? <Label>
                  <strong>{releaseName}</strong>
                  {releaseDate ? <span style={{ whiteSpace: 'nowrap' }}>&emsp;•&emsp;{releaseDate.fromNow()}</span> : null}
                  {releaseDate ? <span style={{ whiteSpace: 'nowrap' }}>&emsp;•&emsp;{releaseDate.format('MMMM YYYY')}</span> : null}
                  {release.name === releaseName && effectiveReleaseNotes !== '' ? <ReleaseBody dangerouslySetInnerHTML={{ __html: effectiveReleaseNotes }} /> : <br />}
                  <Link to={releasesURL}>Read release notes</Link>
                </Label>
              : null}
          </EntryPoint>
          <EntryPoint>
            <Button to="/docs/desktop/getting-started">Get started</Button>
          </EntryPoint>
        </EntryPoints>
      </Lead>

    </Page>
  )
}


const ReleaseBody = styled.div`
  font-size: 90%;

  p {
    margin: .5rem 0;
  }
`
