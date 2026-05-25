import "survey-core/survey-core.min.css"
import "survey-creator-core/survey-creator-core.min.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { applyACNTheme } from './surveyTheme'
import App from './App.jsx'

applyACNTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
