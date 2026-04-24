import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { BookingFlowProvider } from './context/BookingFlowContext.jsx'

import './index.css'
import './App.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <BookingProvider>
            <BookingFlowProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--card)',
                    color: 'var(--text)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                  },
                }}
              />
              <App />
            </BookingFlowProvider>
          </BookingProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
