import AppHeader from './components/layout/AppHeader'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'

/*
  This is the whole router. The app has three screens and which one shows is
  decided entirely by who is signed in, so a routing library would add a
  dependency and a set of URLs without answering a question the app is asking.
*/
export default function App() {
  const { currentUser } = useAuth()

  if (currentUser === null) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">
            Signed in as {currentUser.name}. The{' '}
            {currentUser.role === 'admin' ? 'professor' : 'student'} dashboard comes next.
          </p>
        </div>
      </main>
    </div>
  )
}
