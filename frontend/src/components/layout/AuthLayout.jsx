import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Logo from '../common/Logo'

/*
  The frame shared by sign in and register. Both are a centred card on an empty page, so the chrome lives here and each screen only supplies its own title and fields.
*/
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Logo />
          <span className="text-sm font-semibold">Submission Tracker</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>

          <CardContent>{children}</CardContent>
        </Card>

        {footer}
      </div>
    </div>
  )
}
