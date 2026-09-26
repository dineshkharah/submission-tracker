import { useAuth } from '../../hooks/useAuth'
import { useData } from '../../hooks/useData'
import Logo from '../common/Logo'

const ROLE_LABEL = {
  admin: 'Professor',
  student: 'Student',
}

export default function AppHeader() {
  const { currentUser, logout } = useAuth()
  const { resetData } = useData()

  /*
    Reset exists so the submission flow can be demonstrated more than once
    without clearing site data by hand. A browser confirm is the right size of
    solution for a control that only exists for demos.
  */
  function handleReset() {
    const sure = window.confirm(
      'This puts every assignment and submission back to the sample data. Continue?',
    )

    if (sure) {
      resetData()
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Logo />
          <span className="hidden text-sm font-semibold text-slate-900 sm:block">
            Submission Tracker
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
              {currentUser.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{ROLE_LABEL[currentUser.role]}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset<span className="hidden sm:inline"> data</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-lg bg-accent-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-accent-700"
          >
            Switch<span className="hidden sm:inline"> user</span>
          </button>
        </div>
      </div>
    </header>
  )
}
