import React from 'react'
import ReactDOM from 'react-dom/client'
import { inject } from '@vercel/analytics'
import { NextUIProvider } from '@nextui-org/system'
import App from './App.tsx'
import './index.css'

inject()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </React.StrictMode>
)
