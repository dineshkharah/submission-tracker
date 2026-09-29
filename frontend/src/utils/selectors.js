/*
  This file is where role isolation actually happens.

  Every screen asks for data through one of these functions and never touches
  the raw arrays, so a student screen is only ever handed that student's rows
  and a professor screen is only ever handed the assignments that professor
  created. A component cannot leak somebody else's data because it never
  receives it in the first place.

  Worth saying out loud: this is a boundary in the user interface, not a
  security boundary. All the data sits in the browser, so a determined person
  can read it from the console. A real system would check the logged in user on
  the server, and these functions are exactly where those API calls would go.

  Everything here is a pure function of the data, which makes each one easy to
  read on its own and easy to reason about.
*/

export function getUserById(data, userId) {
  return data.users.find((user) => user.id === userId) ?? null
}

export function getStudents(data) {
  return data.users.filter((user) => user.role === 'student')
}

/*
  A student's assignments are found through their own submission rows, not by
  listing every assignment. That way the join table stays the single source of
  truth for who has been given what.
*/
export function getAssignmentsForStudent(data, studentId) {
  return data.submissions
    .filter((submission) => submission.studentId === studentId)
    .map((submission) => {
      const assignment = data.assignments.find((item) => item.id === submission.assignmentId)
      return assignment === undefined ? null : { ...assignment, submission }
    })
    .filter((item) => item !== null)
    .sort(byDueDate)
}

export function getAssignmentsForAdmin(data, adminId) {
  return data.assignments
    .filter((assignment) => assignment.createdBy === adminId)
    .sort(byDueDate)
}

export function getSubmissionsForAssignment(data, assignmentId) {
  return data.submissions
    .filter((submission) => submission.assignmentId === assignmentId)
    .map((submission) => ({
      ...submission,
      student: getUserById(data, submission.studentId),
    }))
    .filter((row) => row.student !== null)
    .sort((a, b) => a.student.name.localeCompare(b.student.name))
}

export function getStudentProgress(data, studentId) {
  return toProgress(data.submissions.filter((row) => row.studentId === studentId))
}

export function getAssignmentProgress(data, assignmentId) {
  return toProgress(data.submissions.filter((row) => row.assignmentId === assignmentId))
}

function toProgress(rows) {
  const total = rows.length
  const submitted = rows.filter((row) => row.status === 'submitted').length
  const percent = total === 0 ? 0 : Math.round((submitted / total) * 100)

  return { submitted, total, percent }
}

/*
  Due dates are plain YYYY-MM-DD strings, which sort correctly as text, so
  there is no reason to build Date objects here. Building them would actually
  be worse: new Date("2026-10-05") is parsed as UTC midnight, which lands on
  the previous day for anyone behind UTC.
*/
function byDueDate(a, b) {
  return a.dueDate.localeCompare(b.dueDate)
}
