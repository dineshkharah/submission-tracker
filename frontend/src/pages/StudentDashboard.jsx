import EmptyState from '../components/common/EmptyState'
import CourseCard from '../components/student/CourseCard'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { getCourseWorkForStudent, getCoursesForStudent, getUserById } from '../utils/selectors'

/*
  The first screen a student lands on. It answers one question before anything else: is there something waiting on me.

  Waiting means pending or overdue and mine to act on, so an assignment a group leader is handling does not get counted against a member who cannot do anything about it. That is the same canAcknowledge rule the button uses, read here as a number instead of as a control.
*/
export default function StudentDashboard() {
  const data = useData()
  const { currentUser } = useAuth()

  const courses = getCoursesForStudent(data, currentUser.id).map((course) => ({
    course,
    professor: getUserById(data, course.professorId),
    work: getCourseWorkForStudent(data, course.id, currentUser.id),
  }))

  const waiting = courses.reduce(
    (count, entry) =>
      count +
      entry.work.items.filter(
        (item) => item.status.state !== 'acknowledged' && item.status.canAcknowledge,
      ).length,
    0,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your courses</h1>

        <p className="text-muted-foreground mt-1 text-sm">
          {waiting === 0
            ? 'Nothing is waiting on you right now.'
            : `${waiting} ${waiting === 1 ? 'assignment is' : 'assignments are'} waiting on you.`}
        </p>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          message="You are not enrolled in anything. Your courses appear here once a professor adds you."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((entry) => (
            <CourseCard
              key={entry.course.id}
              course={entry.course}
              professor={entry.professor}
              progress={entry.work.progress}
              overdue={entry.work.overdue}
            />
          ))}
        </div>
      )}
    </div>
  )
}
