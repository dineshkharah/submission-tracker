import { createContext } from 'react'

/*
  Kept apart from AuthProvider for the same reason as dataContext, so that fast refresh keeps working and the lint rule stays quiet.
*/
export const AuthContext = createContext(null)
