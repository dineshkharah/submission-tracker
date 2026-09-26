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

  /*
    Three groups, not two. On a phone justify-between spreads them evenly, so
    the name sits in its own space instead of being crushed against the
    buttons. Putting the name and the buttons in one group, which is what this
    used to do, dumped all the free space between the logo and the name.

    From sm up the name group takes ml-auto. A margin set to auto swallows the
    free space before justify-between can share it out, which pulls the name
    and the buttons back together on the right. Without that, three groups
    spread across a 1152px header would leave the name stranded in the middle.
  */
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex shrink-0 items-center gap-2">
          <Logo />
          <span className="hidden text-sm font-semibold text-slate-900 sm:block">
            Submission Tracker
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:ml-auto">
          {/*
            The avatar is hidden on a phone. It sits right beside the full name
            and carries nothing the name does not already say, so on the one
            screen where width is scarce it is the first thing to go.
          */}
          <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 sm:flex">
            {currentUser.initials}
          </span>

          {/*
            Centred on a phone, where the block floats in its own space with
            nothing to line up against. From sm up the avatar is back on its
            left, so it lines up with that instead.
          */}
          <div className="min-w-0 text-center sm:text-left">
            <p className="truncate text-sm font-medium text-slate-900">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{ROLE_LABEL[currentUser.role]}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:px-2.5"
          >
            Reset<span className="hidden sm:inline"> data</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-accent-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-accent-700 sm:px-2.5"
          >
            Switch<span className="hidden sm:inline"> user</span>
          </button>
        </div>
      </div>
    </header>
  )
}
