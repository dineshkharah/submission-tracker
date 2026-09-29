import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/*
  Wraps every route that needs somebody signed in. It reads the same currentUser as the screens do, so a token that has expired or points at a user who no longer exists sends you to the login screen without any special case.

  The path being attempted is passed along, so signing in returns you to where you were heading rather than dumping you on a dashboard. replace is used so the guarded page never enters history, which would otherwise put the back button into a loop.
*/
export default function RequireAuth() {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (currentUser === null) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
