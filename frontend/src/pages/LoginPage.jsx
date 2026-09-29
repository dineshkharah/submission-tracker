import Logo from '../components/common/Logo'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'

export default function LoginPage() {
  const { users } = useData()
  const { login } = useAuth()

  const admins = users.filter((user) => user.role === 'admin')
  const students = users.filter((user) => user.role === 'student')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Submission Tracker</h1>
        </div>

        <p className="mt-3 max-w-xl text-sm text-slate-500">
          Pick who you want to sign in as. There is no real login behind this, it stands in for
          one so that each role can be seen on its own.
        </p>

        <UserGroup title="Professors" users={admins} onPick={login} />
        <UserGroup title="Students" users={students} onPick={login} />
      </div>
    </div>
  )
}

function UserGroup({ title, users, onPick }) {
  return (
    <section className="mt-8">
      <h2 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{title}</h2>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onPick={onPick} />
        ))}
      </div>
    </section>
  )
}

function UserCard({ user, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(user.id)}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-accent-200 hover:bg-accent-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
        {user.initials}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-slate-900">{user.name}</span>
        <span className="block truncate text-xs text-slate-500">{user.email}</span>
      </span>
    </button>
  )
}
