import React from 'react'
import { Root, Routes } from 'react-static'
import { Router } from '@reach/router'
import { Helmet } from 'react-helmet'
import { default as GlobalStyle } from './GlobalStyle'
import { SymbolImage, Logo } from './components/Logo'
import organizationLogoImage from 'assets/riboseopen-logo-dark.svg';


// Any routes that start with 'dynamic' will be treated as non-static routes
//addPrefetchExcludes(['dynamic'])


const App: React.FC<{}> = function () {
  return (
    <Root>
      <GlobalStyle />

      <Helmet>
        <title>Glossarist</title>
      </Helmet>

      <header>
        <Logo size={42} />
      </header>

      <main>
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            {/* <Dynamic path="dynamic" /> */}
            <Routes path="*" />
          </Router>
        </React.Suspense>
      </main>

      <footer>
        <a href="https://open.ribose.com">
          <SymbolImage size={16} src={organizationLogoImage} className="org-logo" />
        </a>
      </footer>
    </Root>
  )
}

export default App
