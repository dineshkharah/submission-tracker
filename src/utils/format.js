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
