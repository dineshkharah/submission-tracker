import { CalendarClock, CheckCircle2, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDateTime, isPast } from '../../utils/format'
import ProgressSummary from '../common/ProgressSummary'
import AssignmentDialog from './AssignmentDialog'

/*
  One assignment as the professor sees it, which is a different question from the student's card. A student asks whether they have handed this in. A professor asks how many have, and which of them still have not.

  So the count answers how it is going and the names answer what to do about it. Only the names of whoever is still waiting are listed, because that is the half that turns into an email.

  The badge says "Past deadline" rather than "Closed", because nothing actually closes here. A student can still acknowledge late and the professor still sees it, which is honest about what the app does.
*/
export default function AssignmentCard({ assignment, breakdown, progress }) {
  const isGroupWork = assignment.submissionType === 'group'
  const overdue = isPast(assignment.deadline)

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{isGroupWork ? 'Group' : 'Individual'}</Badge>

            {overdue ? <Badge className="bg-overdue text-white">Past deadline</Badge> : null}
          </div>

          <AssignmentDialog
            courseId={assignment.courseId}
            assignment={assignment}
            locked={breakdown.done.length > 0}
          />
        </div>

        <CardTitle>{assignment.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{assignment.description}</p>

        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
          <span
            className={`flex items-center gap-1.5 ${overdue ? 'text-overdue font-medium' : 'text-muted-foreground'}`}
          >
            <CalendarClock className="size-4 shrink-0" />
            Due {formatDateTime(assignment.deadline)}
          </span>

          <a
            href={assignment.oneDriveLink}
            target="_blank"
            rel="noreferrer"
            className="text-primary flex w-fit items-center gap-1.5 font-medium hover:underline"
          >
            <ExternalLink className="size-4 shrink-0" />
            Assignment folder
          </a>
        </div>

        <ProgressSummary
          label={isGroupWork ? 'Groups submitted' : 'Students submitted'}
          done={progress.done}
          total={progress.total}
          percent={progress.percent}
        />

        <Separator />

        {breakdown.waiting.length === 0 ? (
          <p className="text-success flex items-center gap-1.5 text-sm font-medium">
            <CheckCircle2 className="size-4 shrink-0" />
            {isGroupWork ? 'Every group has handed in.' : 'Everyone has handed in.'}
          </p>
        ) : (
          <div>
            <p className="text-muted-foreground text-xs">
              Still waiting on {breakdown.waiting.length}{' '}
              {isGroupWork
                ? breakdown.waiting.length === 1
                  ? 'group'
                  : 'groups'
                : breakdown.waiting.length === 1
                  ? 'student'
                  : 'students'}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {breakdown.waiting.map((subject) => (
                <Badge key={subject.id} variant="outline">
                  {subject.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
