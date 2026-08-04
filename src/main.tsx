import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider, applyThemeVars } from './config'
import './index.css'

// Publish --accent / --accent-weak / --accent-soft before first paint so hud.css themes correctly.
applyThemeVars()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
