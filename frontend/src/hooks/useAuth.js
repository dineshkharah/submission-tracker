import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { getUserByEmail, getUserById } from '../utils/selectors'
import { useData } from './useData'

/*
  The single place a screen talks to authentication. It is a hook rather than a context because this is exactly where the two contexts have to meet: the auth context knows the token, the data store knows the users, and checking a password needs both.

  That also keeps AuthProvider free of any idea of what a user is, so the day a real server issues the token, only this file changes.

  currentUser comes back null whenever nobody is signed in, whenever the token has expired, and whenever the id inside it points at somebody who no longer exists. All three mean the same thing to a screen, so they are one answer rather than three.
*/
export function useAuth() {
  const auth = useContext(AuthContext)

  if (auth === null) {
    throw new Error('useAuth has to be called inside an AuthProvider')
  }

  const data = useData()

  const currentUser = auth.payload === null ? null : getUserById(data, auth.payload.sub)

  /*
    Returns the user on success and null on failure, rather than throwing. A wrong password is an ordinary thing for someone to do, not an exceptional one, and the screen needs to put a message under a field rather than catch an error.
  */
  function login(email, password) {
    const user = getUserByEmail(data, email)

    if (user === null || user.password !== password) {
      return null
    }

    auth.signIn(user)

    return user
  }

  /*
    The duplicate email check happens here rather than inside the store, so the store never has to decide what counts as a conflict and the form gets a plain null it can turn into a field error.
  */
  function register({ name, email, password, role }) {
    if (getUserByEmail(data, email) !== null) {
      return null
    }

    const user = data.registerUser({ name, email, password, role })

    auth.signIn(user)

    return user
  }

  return { currentUser, login, register, logout: auth.signOut }
}
