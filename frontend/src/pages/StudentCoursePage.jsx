import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import EmptyState from '../components/common/EmptyState'
import ProgressSummary from '../components/common/ProgressSummary'
import AssignmentCard from '../components/student/AssignmentCard'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { getCourseWorkForStudent, getCoursesForStudent, getUserById } from '../utils/selectors'

/*
  Every assignment in one course, for the student reading it.

  The course is looked up inside their own enrollments rather than in the courses table and then checked against them. Asking the narrower question means a course they are not enrolled in is never found in the first place, so there is no separate permission check to forget.

  A course id that is real but not theirs and one that does not exist get the same answer, which is deliberate: a different message for each would confirm that the first one exists.
*/
export default function StudentCoursePage() {
  const data = useData()
  const { currentUser } = useAuth()
  const { courseId } = useParams()

  const course = getCoursesForStudent(data, currentUser.id).find((item) => item.id === courseId)

  if (course === undefined) {
    return (
      <div className="space-y-6">
        <BackLink />

        <EmptyState
          title="Course not found"
          message="That course is not on your list. Pick one from your dashboard."
        />
      </div>
    )
  }

  const professor = getUserById(data, course.professorId)
  const work = getCourseWorkForStudent(data, course.id, currentUser.id)

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{course.code}</Badge>
            <span className="text-muted-foreground text-xs">{course.term}</span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{professor.name}</p>
        </div>

        <Card className="py-4">
          <CardContent>
            <ProgressSummary
              label="Your progress in this course"
              done={work.progress.done}
              total={work.progress.total}
              percent={work.progress.percent}
            />
          </CardContent>
        </Card>
      </div>

      {work.items.length === 0 ? (
        <EmptyState
          title="No assignments yet"
          message="Nothing has been set for this course. It will appear here when it does."
        />
      ) : (
        <div className="space-y-4">
          {work.items.map((item) => (
            <AssignmentCard
              key={item.assignment.id}
              assignment={item.assignment}
              status={item.status}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/student"
      className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm"
    >
      <ArrowLeft className="size-4" />
      Your courses
    </Link>
  )
}
