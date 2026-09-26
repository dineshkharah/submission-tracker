import { formatSubmittedAt } from '../../utils/format'
import StatusPill from '../common/StatusPill'

/*
  One row per student on a single assignment. The rows arrive already joined to
  their student by getSubmissionsForAssignment, so this component does no
  looking up of its own and simply draws what it is given.
*/
export default function StudentStatusList({ rows }) {
  return (
    <ul className="divide-y divide-slate-100 border-t border-slate-100">
      {rows.map((row) => (
        <li key={row.id} className="flex items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
              {row.student.initials}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{row.student.name}</p>
              {/*
                Just the date, with no "Submitted on" in front of it. The pill
                next to it already says the status, and the longer wording was
                wide enough to get cut off on a phone.
              */}
              <p className="truncate text-xs text-slate-500">
                {row.status === 'submitted'
                  ? formatSubmittedAt(row.submittedAt)
                  : 'Nothing handed in yet'}
              </p>
            </div>
          </div>

          <StatusPill status={row.status} />
        </li>
      ))}
    </ul>
  )
}
