import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EmptyState from '../components/common/EmptyState'
import AssignmentCard from '../components/professor/AssignmentCard'
import AssignmentDialog from '../components/professor/AssignmentDialog'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import {
  getAssignmentBreakdown,
  getAssignmentProgress,
  getAssignmentsForCourse,
  getCourseProgress,
  getCoursesForProfessor,
  getGroupsInCourse,
  getStudentsInCourse,
} from '../utils/selectors'

/*
  Managing one course. The same narrowing as the student's course page: the course is looked for inside the ones this professor teaches, so a course belonging to somebody else is never found and there is no separate check to forget.

  The four figures across the top are the summary counts the task asks for. They are there to make the percentage underneath readable, since a share means something different over eight students than over eighty.
*/
export default function ProfessorCoursePage() {
  const data = useData()
  const { currentUser } = useAuth()
  const { courseId } = useParams()

  const [filter, setFilter] = useState('all')

  const course = getCoursesForProfessor(data, currentUser.id).find((item) => item.id === courseId)

  if (course === undefined) {
    return (
      <div className="space-y-6">
        <BackLink />

        <EmptyState
          title="Course not found"
          message="That course is not one of yours. Pick one from your dashboard."
        />
      </div>
    )
  }

  const students = getStudentsInCourse(data, course.id)
  const groups = getGroupsInCourse(data, course.id)
  const progress = getCourseProgress(data, course.id)

  const items = getAssignmentsForCourse(data, course.id).map((assignment) => ({
    assignment,
    breakdown: getAssignmentBreakdown(data, assignment),
    progress: getAssignmentProgress(data, assignment),
  }))

  const shown = items.filter((item) => {
    if (filter === 'outstanding') {
      return item.breakdown.waiting.length > 0
    }

    if (filter === 'complete') {
      return item.breakdown.waiting.length === 0
    }

    return true
  })

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
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Students" value={students.length} />
          <Stat label="Groups" value={groups.length} />
          <Stat label="Assignments" value={items.length} />
          <Stat label="Submissions in" value={`${progress.percent}%`} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All assignments</SelectItem>
            <SelectItem value="outstanding">Still outstanding</SelectItem>
            <SelectItem value="complete">Fully handed in</SelectItem>
          </SelectContent>
        </Select>

        <AssignmentDialog courseId={course.id} />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No assignments yet"
          message="Create the first one and everyone enrolled on this course will see it."
        />
      ) : shown.length === 0 ? (
        <EmptyState
          title="Nothing matches that filter"
          message="Switch back to all assignments to see the rest of the course."
        />
      ) : (
        <div className="space-y-4">
          {shown.map((item) => (
            <AssignmentCard
              key={item.assignment.id}
              assignment={item.assignment}
              breakdown={item.breakdown}
              progress={item.progress}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <Card className="gap-0 py-4">
      <CardContent className="px-4">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}

function BackLink() {
  return (
    <Link
      to="/professor"
      className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm"
    >
      <ArrowLeft className="size-4" />
      Your courses
    </Link>
  )
}
