 import './pelote-intro.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Le routeur (BrowserRouter) est déjà dans App.jsx : ne pas le rajouter ici.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
