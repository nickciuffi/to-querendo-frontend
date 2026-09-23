import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import App from './App.tsx'
import { AuthProvider } from '@/context/auth-context'
import { LocationSync } from '@/components/location-sync'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocationSync />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
