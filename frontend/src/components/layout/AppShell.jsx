import { LogOut } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '../../hooks/useAuth'
import Logo from '../common/Logo'

const ROLE_LABEL = { professor: 'Professor', student: 'Student' }

/*
  The frame every signed in screen renders inside. It draws the header once and leaves a hole for the page, so no screen has to remember to include navigation.

  It sits below RequireAuth in the route tree, which is why currentUser can be read here without a null check.
*/
export default function AppShell() {
  const { currentUser, logout } = useAuth()

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-card sticky top-0 z-10 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <Logo />
            <span className="hidden text-sm font-semibold sm:block">Submission Tracker</span>
          </Link>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="truncate text-sm font-medium">{currentUser.name}</span>
            <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
              {ROLE_LABEL[currentUser.role]}
            </Badge>

            <Button variant="outline" size="sm" className="shrink-0" onClick={logout}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
