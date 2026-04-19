import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext.jsx'

// Global styles — order matters:
// 1. index.css  → reset, tokens, base typography
// 2. App.css    → app shell, page layout, shared utilities
// 3. layout.css → responsive overrides
import './index.css'
import './App.css'
import './styles/layout.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <App />
      </BookingProvider>
    </BrowserRouter>
  </StrictMode>,
)
