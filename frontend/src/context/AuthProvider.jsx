import { useEffect, useState } from 'react'
import { STORAGE_KEYS, load, remove, save } from '../utils/storage'
import { AuthContext } from './authContext'

/*
  This context holds an id and nothing else. The user object itself is looked
  up from the data store, so there is only one copy of a person's name and role
  in the app. If that were duplicated here, a saved login from an earlier
  session could go stale and start disagreeing with the store.
*/
export function AuthProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(() =>
    load(STORAGE_KEYS.currentUserId, null),
  )

  useEffect(() => {
    if (currentUserId === null) {
      remove(STORAGE_KEYS.currentUserId)
    } else {
      save(STORAGE_KEYS.currentUserId, currentUserId)
    }
  }, [currentUserId])

  function login(userId) {
    setCurrentUserId(userId)
  }

  function logout() {
    setCurrentUserId(null)
  }

  const value = { currentUserId, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
