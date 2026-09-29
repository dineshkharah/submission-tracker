import { createContext } from 'react'

/*
  The context object lives apart from its provider on purpose. A file that exports both a component and a context breaks Vite's fast refresh, because the bundler can no longer tell what to hot reload and falls back to a full page reload. The react/only-export-components lint rule flags it. Same reason the hooks sit in src/hooks rather than next to the providers.
*/
export const DataContext = createContext(null)
