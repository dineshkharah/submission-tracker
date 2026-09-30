import { CalendarClock, ListChecks, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Logo from '../common/Logo'

/*
  The frame shared by sign in and register, and the one screen in the app allowed to be decorative.

  Everywhere else the job is information hierarchy, so ornament would be competing with the thing somebody came to read. This page has no information on it, which is exactly why it can carry the weight of a first impression instead.

  The panel is hidden below lg rather than stacked above the form. On a phone it would push the fields below the fold, and nobody arriving at a sign in screen wants to scroll past a pitch to reach the password box.
*/
const POINTS = [
  {
    icon: CalendarClock,
    title: 'Every deadline in one place',
    body: 'What is due, what is in, and what has already gone past, across all of your courses.',
  },
  {
    icon: Users,
    title: 'One hand in for a whole group',
    body: 'A group leader acknowledges once and every member sees it, with their name against it.',
  },
  {
    icon: ListChecks,
    title: 'Names, not just numbers',
    body: 'Professors see which students are still outstanding, not only how many of them there are.',
  },
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="bg-background min-h-screen lg:grid lg:grid-cols-2">
      <div className="bg-primary text-primary-foreground hidden flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-2">
          <Logo inverted />
          <span className="font-semibold">Submission Tracker</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl leading-tight font-semibold tracking-tight">
            Coursework, groups and deadlines, without the guesswork.
          </h2>

          <ul className="mt-8 space-y-6">
            {POINTS.map((point) => (
              <li key={point.title} className="flex gap-3">
                <point.icon className="mt-0.5 size-5 shrink-0" />

                <div>
                  <p className="font-medium">{point.title}</p>
                  <p className="mt-0.5 text-sm opacity-80">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm opacity-70">Built for the Joineazy frontend task.</p>
      </div>

      <div className="flex min-h-screen items-center justify-center p-4 lg:min-h-0">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <Logo />
            <span className="text-sm font-semibold">Submission Tracker</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </CardHeader>

            <CardContent>{children}</CardContent>
          </Card>

          {footer}
        </div>
      </div>
    </div>
  )
}
