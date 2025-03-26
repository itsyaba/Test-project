import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import 'styles/index.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'

const element = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(element)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CssBaseline />
      <App />
    </AuthProvider>
  </React.StrictMode>
)
