/*
  Every empty list in the app uses this, so a screen with nothing on it still says something useful rather than going blank. The title names what is missing and the message says what would fill it.
*/
export default function EmptyState({ title, message }) {
  return (
    <div className="border-border bg-card rounded-lg border border-dashed p-8 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{message}</p>
    </div>
  )
}
