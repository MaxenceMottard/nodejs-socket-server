import * as React from 'react'
import {render} from 'react-dom'
import {injectGlobal} from 'styled-components'
import {App} from './components/App'

injectGlobal`
  html,
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    
    #app {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100%;
      width: 100%;
      display: grid;
      grid-template-columns: 300px 1fr;
    }
  }
`


render(<App />, document.getElementById('app'))

