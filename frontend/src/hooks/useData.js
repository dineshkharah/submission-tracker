import { useContext } from 'react'
import { DataContext } from '../context/dataContext'

/*
  The hooks live in their own files rather than next to the contexts because a
  file that exports both a provider component and a hook breaks Vite's fast
  refresh, and the lint rule react/only-export-components flags it.
*/
export function useData() {
  const value = useContext(DataContext)

  if (value === null) {
    throw new Error('useData has to be called inside a DataProvider')
  }

  return value
}
