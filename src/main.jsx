import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './styles/tokens.css'
import './styles/ui.css'
import './styles/patterns.css'
import './styles/form.css'
import './styles/overlay.css'
import App from './App.jsx'
import ToastProvider from './components/Toast.jsx'
import StoreProvider from './store/StoreProvider.jsx'

// HashRouter: GitHub Pages has no SPA fallback, so deep links live after "#"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
)
