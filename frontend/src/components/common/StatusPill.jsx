/*
  Every class name here is written out in full rather than built from the
  status, because Tailwind reads this file as text and only compiles the class
  names it can actually see.
*/
const PILL = {
  submitted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  not_submitted: 'bg-amber-50 text-amber-700 ring-amber-200',
}

const DOT = {
  submitted: 'bg-emerald-500',
  not_submitted: 'bg-amber-500',
}

const LABEL = {
  submitted: 'Submitted',
  not_submitted: 'Not submitted',
}

export default function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${PILL[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {LABEL[status]}
    </span>
  )
}
