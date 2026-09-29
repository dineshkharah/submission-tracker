/*
  Deliberately dumb and shared by both roles. It takes a count and a total and
  knows nothing about assignments or students, so the student summary and the
  professor's per assignment bar are the same component.

  The width class is put together at runtime, which only works because
  index.css asks Tailwind to generate every percentage width up front. See the
  comment on @source inline in that file.
*/
export default function ProgressBar({ value, max }) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100)
  const width = `w-[${percent}%]`
  const fill = percent === 100 ? 'bg-emerald-500' : 'bg-accent-600'

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full ${fill} ${width}`} />
    </div>
  )
}
