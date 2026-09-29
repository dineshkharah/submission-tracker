import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { getUserById } from '../utils/selectors'
import { useData } from './useData'

/*
  The context stores only an id, so this hook resolves it against the data
  store and hands back the whole user. That is why AuthProvider has to sit
  inside DataProvider in main.jsx.

  Returning null for a missing user is deliberate rather than a bug to guard
  against. A saved id can point at somebody who no longer exists, and in that
  case the app should show the login screen again, which is exactly what
  App.jsx does when currentUser is null.
*/
export function useAuth() {
  const auth = useContext(AuthContext)

  if (auth === null) {
    throw new Error('useAuth has to be called inside an AuthProvider')
  }

  const data = useData()

  const currentUser =
    auth.currentUserId === null ? null : getUserById(data, auth.currentUserId)

  return { ...auth, currentUser }
}
