import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TRPCProvider } from './trpc/provider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TRPCProvider>
      <App />
    </TRPCProvider>
  </StrictMode>,
)
