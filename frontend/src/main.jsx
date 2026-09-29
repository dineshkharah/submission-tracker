import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { DataProvider } from './context/DataProvider.jsx'
import './index.css'

/*
  DataProvider has to wrap AuthProvider. The auth context stores only a user
  id, and useAuth resolves that id against the data store, so the store has to
  exist further up the tree.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DataProvider>
  </StrictMode>,
)
