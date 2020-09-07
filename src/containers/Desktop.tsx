import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteData } from 'react-static'
import styled from 'styled-components'

import moment from 'moment'

import { Octokit } from '@octokit/rest'
import { ReposGetLatestReleaseResponseData } from '@octokit/types'
import { ReposListReleasesResponseData } from '@octokit/types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'

import Page from 'containers/Page'
import { Link, Button } from 'components/linksButtons'
import { Lead } from '@riboseinc/aperis-doc-pages/typography'
import { EntryPoints, EntryPoint, Label } from 'components/entryPoints'


const repoOwner = 'glossarist'
const repoName = 'glossarist-desktop'

const octokit = new Octokit()

type ReleaseList = (ReposListReleasesResponseData[number] & { bodyHTML: string })[]

type OS = 'macOS' | 'Windows' | 'Ubuntu Linux'


export default () => {
  const routeData: { releases: ReleaseList } = useRouteData()

  const releaseAtBuild = routeData.releases[0] || undefined

  const [releaseData, setReleaseData] =
    useState<ReposGetLatestReleaseResponseData | undefined>(releaseAtBuild)

  const [userOS, setUserOS] =
    useState<OS | undefined>(undefined)

  const [specificDLLink, setSpecificDLLink] =
    useState<string | undefined>(releaseAtBuild && userOS
      ? getSpecificDLLink(
          routeData.releases[0]?.assets || [],
          releaseAtBuild.name,
          userOS)
      : undefined)

  useEffect(() => {
    (async () => {
      const release = await octokit.repos.getLatestRelease({
        owner: repoOwner,
        repo: repoName,
      })
      setReleaseData(release.data)
    })()
  }, [])

  useEffect(() => {
    if (releaseData && userOS) {
      const link = getSpecificDLLink(
        releaseData.assets,
        releaseData.name,
        userOS)
      if (link) {
        setSpecificDLLink(link)
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
      } else if (ua.indexOf('Ubuntu') >= 0) {
        setUserOS('Ubuntu Linux')
      }
    }
  }, [])

  const releasesURL = `${getGithubLink(repoOwner, repoName)}/releases`

  const releaseName = releaseData?.name

  const releaseDate = releaseData
    ? moment(releaseData.published_at)
    : undefined

  const releaseNotesAtBuild = releaseAtBuild?.bodyHTML?.trim() || ''

  const effectiveReleaseNotes = releaseAtBuild?.name === releaseName
    ? releaseNotesAtBuild
    : `<p>${(releaseData?.body || '').split('\n')[0] || ''}</p>`
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
          Manage a&nbsp;concept&nbsp;system
          from&nbsp;an&nbsp;app that&nbsp;runs
          on&nbsp;your&nbsp;computer.
        </p>

        <EntryPoints fill labelPosition="bottom">
          <EntryPoint>
            {userOS && specificDLLink
              ? <Button
                    to={specificDLLink}
                    title={`Download${releaseName ? ` v${releaseName}` : null} for ${userOS}`}>
                  <FontAwesomeIcon icon={faDownload} />
                  &ensp;
                  Download for {userOS}
                </Button>
              : <Button to={releasesURL}>
                  Download
                </Button>}
              <Label>
                <span style={{ whiteSpace: 'nowrap'}}>
                  {releaseName
                    ? <><strong>Version {releaseName}</strong>&emsp;•&emsp;</>
                    : null}
                  {releaseDate
                    ? <time dateTime={releaseDate.toISOString()}>
                        {releaseDate.fromNow()}
                        &emsp;•&emsp;
                        {releaseDate.format('MMMM YYYY')}
                      </time>
                    : null}
                </span>
                {releaseAtBuild?.name === releaseName && effectiveReleaseNotes !== ''
                  ? <ReleaseBody dangerouslySetInnerHTML={{ __html: effectiveReleaseNotes }} />
                  : <br />}
                <Link to={releasesURL}>
                  <FontAwesomeIcon icon={faGithub} />
                  &ensp;
                  Read all release notes
                </Link>
              </Label>
          </EntryPoint>
          <EntryPoint>
            <Button to="/docs/desktop/getting-started">
              <FontAwesomeIcon icon={faBookOpen} />
              &ensp;
              Get started
            </Button>
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


function getSpecificDLLink(
  assets: ReposGetLatestReleaseResponseData["assets"],
  releaseName: string,
  userOS: OS,
): string | undefined {
  let expectedOSAssetName: string

  if (userOS === 'Windows') {
    expectedOSAssetName = `glossarist-desktop-${releaseName}-portable.exe`
  } else if (userOS === 'macOS') {
    expectedOSAssetName = `glossarist-desktop-${releaseName}.dmg`
  } else if (userOS === 'Ubuntu Linux') {
    expectedOSAssetName = `glossarist-desktop-${releaseName}.snap`
  }

  const asset = assets.find(a => a.name === expectedOSAssetName)

  if (asset && asset.browser_download_url) {
    return asset.browser_download_url
  } else {
    return undefined
  }
}


function getGithubLink(
  githubRepoOwner: string,
  githubRepoName: string,
): string {
  return `https://github.com/${githubRepoOwner}/${githubRepoName}`
}
