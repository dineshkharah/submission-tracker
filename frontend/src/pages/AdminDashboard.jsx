import { useState } from 'react'
import AssignmentAdminCard from '../components/admin/AssignmentAdminCard'
import CreateAssignmentForm from '../components/admin/CreateAssignmentForm'
import EmptyState from '../components/common/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import {
  getAssignmentProgress,
  getAssignmentsForAdmin,
  getSubmissionsForAssignment,
} from '../utils/selectors'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const data = useData()

  const [isFormOpen, setIsFormOpen] = useState(false)

  const assignments = getAssignmentsForAdmin(data, currentUser.id)

  /*
    createAssignment also writes one not_submitted row for every student, so a
    brand new assignment arrives with a full list of names and a denominator
    for its progress bar rather than an empty one.
  */
  function handleCreate(fields) {
    data.createAssignment({ ...fields, createdBy: currentUser.id })
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">Your assignments</h2>
            <p className="mt-1 text-sm text-slate-500">
              You have set {assignments.length}{' '}
              {assignments.length === 1 ? 'assignment' : 'assignments'}. Only the ones you created
              show up here.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="shrink-0 rounded-lg bg-accent-600 px-3 py-2 text-xs font-medium text-white hover:bg-accent-700"
          >
            {isFormOpen ? 'Cancel' : 'New assignment'}
          </button>
        </div>

        {isFormOpen ? (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <CreateAssignmentForm onCreate={handleCreate} />
          </div>
        ) : null}
      </section>

      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments yet"
          message="Create one and every student will see it straight away."
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {assignments.map((assignment) => (
            <AssignmentAdminCard
              key={assignment.id}
              assignment={assignment}
              rows={getSubmissionsForAssignment(data, assignment.id)}
              progress={getAssignmentProgress(data, assignment.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
