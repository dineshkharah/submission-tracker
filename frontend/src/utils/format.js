const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/*
  Round 1 deliberately split a YYYY-MM-DD due date as text, because new Date("2026-10-05") is read as UTC midnight and shows the day before for anyone behind UTC.

  Round 2 deadlines carry a time, so they are full ISO timestamps and do describe a real moment. A Date is now the right tool, and the value is shown in the reader's own timezone, which is what they want from a deadline.

  Formatting is done by hand rather than with toLocaleString so the result reads the same on every machine.
*/
function parts(value) {
  const when = new Date(value)

  const hours = when.getHours()
  const suffix = hours < 12 ? 'am' : 'pm'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const minutes = String(when.getMinutes()).padStart(2, '0')

  return {
    date: `${when.getDate()} ${MONTHS[when.getMonth()]} ${when.getFullYear()}`,
    time: `${hour12}:${minutes} ${suffix}`,
  }
}

export function formatDate(value) {
  if (!value) {
    return ''
  }

  return parts(value).date
}

export function formatDateTime(value) {
  if (!value) {
    return ''
  }

  const { date, time } = parts(value)

  return `${date}, ${time}`
}

/*
  A datetime-local input speaks "YYYY-MM-DDTHH:mm" in whatever timezone the reader is sitting in, while a deadline is stored as a full ISO timestamp. These two convert between the pair.

  The parts are read off the local Date rather than sliced out of toISOString, because toISOString answers in UTC and would hand a professor in India a time five and a half hours away from the one they just typed.
*/
export function toLocalInput(value) {
  if (!value) {
    return ''
  }

  const when = new Date(value)
  const pad = (number) => String(number).padStart(2, '0')

  return `${when.getFullYear()}-${pad(when.getMonth() + 1)}-${pad(when.getDate())}T${pad(when.getHours())}:${pad(when.getMinutes())}`
}

export function fromLocalInput(value) {
  if (!value) {
    return ''
  }

  return new Date(value).toISOString()
}

/*
  Whether a deadline has gone by. Used to tell a pending assignment apart from an overdue one, which is the difference between an amber badge and a red one.
*/
export function isPast(value) {
  if (!value) {
    return false
  }

  return new Date(value).getTime() < Date.now()
}
