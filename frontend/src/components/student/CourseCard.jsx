import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProgressSummary from '../common/ProgressSummary'

/*
  One enrolled course on the student dashboard.

  The whole card is the link rather than a button inside it. That makes the target the size of the card on a phone, and it keeps one clickable thing per card, which is what a screen reader and a keyboard both want.

  The overdue line only appears when there is something overdue. A row reading "0 overdue" on every card would make the one card that matters harder to find, not easier.
*/
export default function CourseCard({ course, professor, progress, overdue }) {
  return (
    <Link
      to={`/student/courses/${course.id}`}
      className="focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Card className="hover:border-primary h-full gap-4 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{course.code}</Badge>
            <span className="text-muted-foreground text-xs">{course.term}</span>
          </div>

          <CardTitle>{course.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{professor.name}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <ProgressSummary
            label="Acknowledged"
            done={progress.done}
            total={progress.total}
            percent={progress.percent}
          />

          {overdue > 0 ? (
            <p className="text-overdue flex items-center gap-1.5 text-sm font-medium">
              <AlertTriangle className="size-4 shrink-0" />
              {overdue} overdue
            </p>
          ) : null}

          <p className="text-primary flex items-center gap-1 text-sm font-medium">
            View assignments
            <ArrowRight className="size-4" />
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
