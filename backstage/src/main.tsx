// import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import {HashRouter} from 'react-router-dom'
import Routes from './router/index.tsx'
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <HashRouter>
      <Routes/>
    </HashRouter>
  // </React.StrictMode>,
)
