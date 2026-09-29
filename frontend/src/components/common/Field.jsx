import { Label } from '@/components/ui/label'

/*
  A label, a field and its error message in the arrangement all three forms need: sign in, register, and the assignment form the professor uses.

  It takes the input as children rather than rendering one itself, so it works with an Input, a Textarea or a Select without knowing anything about them. That keeps it a piece of layout rather than a wrapper around shadcn.

  A hint is hidden while an error is showing, because two lines of small text under one field is where a form starts looking noisy.
*/
export default function Field({ id, label, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>

      {children}

      {error ? <p className="text-destructive text-xs">{error}</p> : null}

      {hint && !error ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  )
}
