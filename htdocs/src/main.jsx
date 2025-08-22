import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

import './index.css'
import Router from './router/Router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      {/* </AuthProvider> */}
    </BrowserRouter>
  </StrictMode>,
)