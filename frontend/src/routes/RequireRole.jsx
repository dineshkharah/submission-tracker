import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/*
  Keeps each role out of the other's pages. It always sits inside RequireAuth, so currentUser is never null by the time this runs.

  Sending a mismatch to "/" rather than showing a refusal is deliberate: "/" immediately redirects to whichever dashboard the person does belong on, so a student who types a professor URL simply lands on their own screen instead of reading an error about a page that was never theirs.
*/
export default function RequireRole({ role }) {
  const { currentUser } = useAuth()

  if (currentUser.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
