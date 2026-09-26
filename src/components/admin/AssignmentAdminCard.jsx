import { useState } from 'react'
import { formatDueDate } from '../../utils/format'
import ProgressBar from '../common/ProgressBar'
import StudentStatusList from './StudentStatusList'

/*
  Whether the student list is open is held here rather than in the dashboard,
  because nothing outside this card needs to know. Each card opens and closes
  on its own.
*/
export default function AssignmentAdminCard({ assignment, rows, progress }) {
  const [isListOpen, setIsListOpen] = useState(false)

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{assignment.title}</h3>
          <p className="mt-1 text-xs text-slate-500">Due {formatDueDate(assignment.dueDate)}</p>
        </div>

        <p className="shrink-0 text-lg font-semibold text-slate-900">{progress.percent}%</p>
      </div>

      <p className="mt-2 text-sm text-slate-500">{assignment.description}</p>

      <p className="mt-4 text-xs text-slate-500">
        {progress.submitted} of {progress.total} students submitted
      </p>

      <div className="mt-2">
        <ProgressBar value={progress.submitted} max={progress.total} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Open Drive folder
        </a>

        <button
          type="button"
          onClick={() => setIsListOpen(!isListOpen)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {isListOpen ? 'Hide students' : `Show all ${progress.total} students`}
        </button>
      </div>

      {isListOpen ? (
        <div className="mt-4">
          <StudentStatusList rows={rows} />
        </div>
      ) : null}
    </article>
  )
}
