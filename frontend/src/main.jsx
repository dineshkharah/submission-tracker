import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { DataProvider } from './context/DataProvider.jsx'
import './index.css'

/*
  DataProvider has to wrap AuthProvider. The auth context holds only a token, and useAuth resolves the id inside it against the data store, so the store has to exist further up the tree.

  The Toaster is mounted once here rather than on each screen, so any component can call toast() without arranging for somewhere to put it.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
)
