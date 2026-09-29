import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/*
  The role based redirect the task asks for, and the whole of it. "/" is not a screen, it is a decision about which dashboard you belong on, so it renders nothing and sends you there.

  Having one place that answers that question means login, register and a role mismatch can all just go to "/" and be routed correctly, instead of each working it out again.
*/
export default function RoleHome() {
  const { currentUser } = useAuth()

  return <Navigate to={currentUser.role === 'professor' ? '/professor' : '/student'} replace />
}
