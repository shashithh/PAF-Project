import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { BookingFlowProvider } from './context/BookingFlowContext.jsx'

import './index.css'
import './App.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <BookingFlowProvider>
            <App />
          </BookingFlowProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
