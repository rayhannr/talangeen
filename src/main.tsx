import React from 'react'
import ReactDOM from 'react-dom/client'
import { inject } from '@vercel/analytics'
import { NextUIProvider } from '@nextui-org/system'
import App from './App.tsx'
import { Provider } from 'jotai'
import { store } from './stores/index.ts'
import './index.css'

inject()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  </React.StrictMode>
)
