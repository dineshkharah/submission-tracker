import { Navigate, Route, Routes } from 'react-router'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import ProfessorDashboard from './pages/ProfessorDashboard'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import RequireAuth from './routes/RequireAuth'
import RequireRole from './routes/RequireRole'
import RoleHome from './routes/RoleHome'

/*
  The whole route table, deliberately in one readable block.

  It nests rather than repeating checks. RequireAuth wraps everything private, so no page below it ever has to ask whether somebody is signed in. AppShell then draws the header once for all of them. RequireRole wraps each role's section, so no page has to ask whose it is either. Every screen below can just read currentUser and get on with it.

  RoleHome sits outside AppShell on purpose. It renders nothing and redirects, so putting it inside would flash a header for an instant on the way past.
*/
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<RoleHome />} />

        <Route element={<AppShell />}>
          <Route element={<RequireRole role="professor" />}>
            <Route path="/professor" element={<ProfessorDashboard />} />
          </Route>

          <Route element={<RequireRole role="student" />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Anything unrecognised goes to "/", which decides where that person belongs, or to the login screen if nobody is signed in. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
