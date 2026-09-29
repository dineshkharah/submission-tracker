const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/*
  A due date is a plain YYYY-MM-DD string with no time and no timezone, so it
  gets split as text. Building a Date from it would be worse, because
  new Date("2026-10-05") is read as UTC midnight and shows the day before for
  anyone behind UTC.
*/
export function formatDueDate(value) {
  const [year, month, day] = value.split('-')

  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`
}

/*
  A submitted time is a full timestamp, so it does describe a real moment and a
  Date is the right tool. Formatting is done by hand rather than with
  toLocaleDateString so that the result reads the same on every machine.
*/
export function formatSubmittedAt(value) {
  if (value === null) {
    return ''
  }

  const when = new Date(value)

  return `${when.getDate()} ${MONTHS[when.getMonth()]} ${when.getFullYear()}`
}

/*
  Today in the same YYYY-MM-DD shape the rest of the app uses, built from the
  local date rather than from toISOString, which would give the UTC date and be
  a day out for part of the evening in India.

  Because the shape sorts correctly as text, a past date can be spotted with a
  plain string comparison and no Date maths.
*/
export function todayAsText() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${now.getFullYear()}-${month}-${day}`
}
