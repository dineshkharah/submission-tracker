import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadRaw, remove, saveRaw } from '../utils/storage'
import { makeToken, readToken } from '../utils/token'
import { AuthContext } from './authContext'

/*
  This context holds a token and nothing else. It does not know what a user is, cannot look one up, and has no opinion about passwords. That work lives in the useAuth hook, which is where the auth context and the data store meet.

  Keeping the provider this thin means the whole of "who is signed in" is one string, which is the same thing a real app would hold, and swapping the fake token for one issued by a server would not change this file at all.

  The payload is derived on every render rather than stored beside the token. Two copies of the same fact can disagree, and an expiring token is exactly the kind of fact that goes stale while it sits there.
*/
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => loadRaw(STORAGE_KEYS.token))

  useEffect(() => {
    if (token === null) {
      remove(STORAGE_KEYS.token)
    } else {
      saveRaw(STORAGE_KEYS.token, token)
    }
  }, [token])

  function signIn(user) {
    setToken(makeToken(user))
  }

  function signOut() {
    setToken(null)
  }

  const value = { token, payload: readToken(token), signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
