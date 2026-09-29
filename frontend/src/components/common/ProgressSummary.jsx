import { Progress } from '@/components/ui/progress'

/*
  A labelled bar with the counts above it. Used for a student's own progress through a course and, on the professor's side, for how much of an assignment is in.

  The counts are shown as "7 of 9" rather than only as a percentage, because a bar already says roughly how far along something is and the thing a percentage hides is how many people that actually leaves.
*/
export default function ProgressSummary({ label, done, total, percent }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {done} of {total}
        </span>
      </div>

      <Progress value={percent} />
    </div>
  )
}
