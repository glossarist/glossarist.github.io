import React from 'react'
import { Root, Routes } from 'react-static'
import { Router } from '@reach/router'
import { Helmet } from 'react-helmet'
import { default as GlobalStyle } from './GlobalStyle'
import { Symbol } from './components/Logo'


// Any routes that start with 'dynamic' will be treated as non-static routes
//addPrefetchExcludes(['dynamic'])


const App: React.FC<{}> = function () {
  return (
    <Root>

      <GlobalStyle />

      <Helmet>
        <title>Glossarist</title>
        <meta charSet="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <React.Suspense fallback={<Symbol size={42} />}>
        <Router>
          {/* <Dynamic path="dynamic" /> */}
          <Routes path="*" />
        </Router>
      </React.Suspense>

    </Root>
  )
}

export default App
