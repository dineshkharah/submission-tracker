import { useState } from 'react'
import EmptyState from '../components/common/EmptyState'
import AssignmentCard from '../components/student/AssignmentCard'
import StudentProgressSummary from '../components/student/StudentProgressSummary'
import SubmissionModal from '../components/student/SubmissionModal'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { getAssignmentsForStudent, getStudentProgress } from '../utils/selectors'

export default function StudentDashboard() {
  const { currentUser } = useAuth()
  const data = useData()

  /*
    Which assignment the modal is about is held here rather than inside the
    modal, because the card that starts the flow and the modal that finishes it
    are siblings. Null means no modal, so closing unmounts it and the two step
    state inside resets without any extra code.
  */
  const [chosenAssignment, setChosenAssignment] = useState(null)

  const assignments = getAssignmentsForStudent(data, currentUser.id)
  const progress = getStudentProgress(data, currentUser.id)

  function handleConfirm(submissionLink) {
    data.markSubmitted(chosenAssignment.id, currentUser.id, submissionLink)
    setChosenAssignment(null)
  }

  return (
    <div className="space-y-6">
      <StudentProgressSummary progress={progress} />

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Your assignments</h2>

        {assignments.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="Nothing to do yet"
              message="When a professor sets an assignment it will show up here."
            />
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onMarkSubmitted={setChosenAssignment}
              />
            ))}
          </div>
        )}
      </section>

      {chosenAssignment === null ? null : (
        <SubmissionModal
          assignment={chosenAssignment}
          onClose={() => setChosenAssignment(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
