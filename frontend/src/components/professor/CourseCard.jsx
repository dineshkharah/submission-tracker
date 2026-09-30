import { ArrowRight, FileText, Users } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProgressSummary from '../common/ProgressSummary'

/*
  One course a professor teaches, on their dashboard.

  The headline is the share of everything expected across the whole course that is actually in, so a professor can see where a course stands before opening it. The two counts under it are there to make that share readable: 40 percent means something different over eight students than over eighty.
*/
export default function CourseCard({ course, students, assignments, progress }) {
  return (
    <Link
      to={`/professor/courses/${course.id}`}
      className="focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Card className="hover:border-primary h-full gap-4 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{course.code}</Badge>
            <span className="text-muted-foreground text-xs">{course.term}</span>
          </div>

          <CardTitle>{course.title}</CardTitle>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5">
              <Users className="size-4 shrink-0" />
              {students} students
            </span>

            <span className="flex items-center gap-1.5">
              <FileText className="size-4 shrink-0" />
              {assignments} assignments
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <ProgressSummary
            label="Submissions in"
            done={progress.done}
            total={progress.total}
            percent={progress.percent}
          />

          <p className="text-primary flex items-center gap-1 text-sm font-medium">
            Manage assignments
            <ArrowRight className="size-4" />
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
