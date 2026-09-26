import { formatDueDate, formatSubmittedAt } from '../../utils/format'
import StatusPill from '../common/StatusPill'

/*
  Presentational on purpose. It is handed one assignment with its own
  submission row already attached and reports a click back up, so it holds no
  state and never reaches into the store itself.
*/
export default function AssignmentCard({ assignment, onMarkSubmitted }) {
  const { submission } = assignment
  const isSubmitted = submission.status === 'submitted'

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-sm font-semibold wrap-break-word text-slate-900 sm:text-base">
          {assignment.title}
        </h3>
        <StatusPill status={submission.status} />
      </div>

      {assignment.description === '' ? null : (
        <p className="mt-2 text-sm wrap-break-word text-slate-500">{assignment.description}</p>
      )}

      <p className="mt-3 text-xs text-slate-500">Due {formatDueDate(assignment.dueDate)}</p>

      {isSubmitted ? (
        <p className="mt-1 text-xs font-medium text-emerald-600">
          Submitted on {formatSubmittedAt(submission.submittedAt)}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 pt-1">
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Open Drive folder
        </a>

        {isSubmitted ? null : (
          <button
            type="button"
            onClick={() => onMarkSubmitted(assignment)}
            className="rounded-lg bg-accent-600 px-3 py-2 text-xs font-medium text-white hover:bg-accent-700"
          >
            Mark as submitted
          </button>
        )}
      </div>
    </article>
  )
}
