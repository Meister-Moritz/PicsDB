import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './static/CSS/GeneralLayout.css'
import './static/CSS/GeneralDesign.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
