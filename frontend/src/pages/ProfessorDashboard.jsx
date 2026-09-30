import EmptyState from '../components/common/EmptyState'
import CourseCard from '../components/professor/CourseCard'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import {
  getAssignmentsForCourse,
  getCourseProgress,
  getCoursesForProfessor,
  getStudentsInCourse,
} from '../utils/selectors'

/*
  Every course this professor teaches, with enough on each card to see where it stands without opening it.

  The headline across the top is how many students are still waiting to be chased, counted across every course. It is the one number that turns into work for them, so it goes first.
*/
export default function ProfessorDashboard() {
  const data = useData()
  const { currentUser } = useAuth()

  const courses = getCoursesForProfessor(data, currentUser.id).map((course) => ({
    course,
    students: getStudentsInCourse(data, course.id).length,
    assignments: getAssignmentsForCourse(data, course.id).length,
    progress: getCourseProgress(data, course.id),
  }))

  const outstanding = courses.reduce(
    (count, entry) => count + (entry.progress.total - entry.progress.done),
    0,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your courses</h1>

        <p className="text-muted-foreground mt-1 text-sm">
          {outstanding === 0
            ? 'Everything set so far has been handed in.'
            : `${outstanding} ${outstanding === 1 ? 'submission is' : 'submissions are'} still outstanding across your courses.`}
        </p>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          message="Courses you teach appear here along with how far each one has got."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((entry) => (
            <CourseCard
              key={entry.course.id}
              course={entry.course}
              students={entry.students}
              assignments={entry.assignments}
              progress={entry.progress}
            />
          ))}
        </div>
      )}
    </div>
  )
}
