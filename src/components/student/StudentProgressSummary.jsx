import ProgressBar from '../common/ProgressBar'

export default function StudentProgressSummary({ progress }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Your progress</h2>
        <p className="text-2xl font-semibold text-slate-900">{progress.percent}%</p>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        {progress.submitted} of {progress.total} assignments submitted
      </p>

      <div className="mt-3">
        <ProgressBar value={progress.submitted} max={progress.total} />
      </div>
    </section>
  )
}
