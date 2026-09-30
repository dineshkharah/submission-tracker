// The extension is spelled out so this file runs under plain node as well as through Vite, which is what lets the selectors be checked by a script without rendering anything.
import { isPast } from './format.js'

/*
  Every read in the app goes through a function in this file. No screen touches the raw arrays, so each one is handed only the slice its role is allowed to see and cannot render somebody else's data because it never receives it.

  Worth saying before anyone asks: this is a boundary in the user interface, not a security boundary. Every row sits in the browser and can be read from the console. A real system checks the signed in user on the server for each request, and these functions are exactly where those calls would go.

  Everything here is a pure function of the data, which is why it can be checked with a plain node script without rendering anything.
*/

/* Users */

export function getUserById(data, userId) {
  return data.users.find((user) => user.id === userId) ?? null
}

export function getUserByEmail(data, email) {
  const wanted = email.trim().toLowerCase()

  return data.users.find((user) => user.email.toLowerCase() === wanted) ?? null
}

/* Courses */

export function getCourseById(data, courseId) {
  return data.courses.find((course) => course.id === courseId) ?? null
}

export function getCoursesForProfessor(data, professorId) {
  return data.courses.filter((course) => course.professorId === professorId)
}

/*
  A student's courses are found through their enrollment rows rather than by listing every course, so the enrollment table stays the single answer to who is in what.
*/
export function getCoursesForStudent(data, studentId) {
  return data.enrollments
    .filter((row) => row.studentId === studentId)
    .map((row) => getCourseById(data, row.courseId))
    .filter((course) => course !== null)
}

export function getStudentsInCourse(data, courseId) {
  return data.enrollments
    .filter((row) => row.courseId === courseId)
    .map((row) => getUserById(data, row.studentId))
    .filter((user) => user !== null)
    .sort(byName)
}

/* Groups */

export function getGroupsInCourse(data, courseId) {
  return data.groups.filter((group) => group.courseId === courseId)
}

/*
  The group a student belongs to within one course. Null is a real answer, not a failure: a student can be enrolled and in no group, and that is the case the task asks us to show a prompt for.
*/
export function getGroupForStudent(data, courseId, studentId) {
  const memberships = data.groupMembers.filter((row) => row.studentId === studentId)

  for (const membership of memberships) {
    const group = data.groups.find((item) => item.id === membership.groupId)

    if (group !== undefined && group.courseId === courseId) {
      return group
    }
  }

  return null
}

export function getGroupMembers(data, groupId) {
  return data.groupMembers
    .filter((row) => row.groupId === groupId)
    .map((row) => getUserById(data, row.studentId))
    .filter((user) => user !== null)
    .sort(byName)
}

/* Assignments */

export function getAssignmentById(data, assignmentId) {
  return data.assignments.find((item) => item.id === assignmentId) ?? null
}

export function getAssignmentsForCourse(data, courseId) {
  return data.assignments
    .filter((assignment) => assignment.courseId === courseId)
    .sort(byDeadline)
}

/* Acknowledgments, which is where the group rule lives */

/*
  An acknowledgment belongs to whoever is accountable for the work. For individual work that is the student. For group work that is the group. So the row points at a subject rather than always at a student, and this is the function that resolves which subject to look for.

  The consequence is that a group leader writes one row and every member reads it. Members are never written to, so there is nothing to keep in sync and nothing goes stale if the membership changes later.
*/
export function getAcknowledgment(data, assignment, studentId) {
  if (assignment.submissionType === 'group') {
    const group = getGroupForStudent(data, assignment.courseId, studentId)

    if (group === null) {
      return null
    }

    return findAcknowledgment(data, assignment.id, 'group', group.id)
  }

  return findAcknowledgment(data, assignment.id, 'student', studentId)
}

function findAcknowledgment(data, assignmentId, subjectType, subjectId) {
  return (
    data.acknowledgments.find(
      (row) =>
        row.assignmentId === assignmentId &&
        row.subjectType === subjectType &&
        row.subjectId === subjectId,
    ) ?? null
  )
}

/*
  Everything a student's screen needs about one assignment, worked out in one place so no component has to reason about submission types.

  state is what the badge shows. no_group comes first because a student with no group cannot be pending or overdue on work they have no way to hand in.

  canAcknowledge is the whole permission rule: for group work only the leader, for individual work always yourself. A member gets the status and no control.
*/
export function getAssignmentStatusForStudent(data, assignment, studentId) {
  const isGroupWork = assignment.submissionType === 'group'
  const group = isGroupWork ? getGroupForStudent(data, assignment.courseId, studentId) : null

  if (isGroupWork && group === null) {
    return { state: 'no_group', acknowledgment: null, group: null, canAcknowledge: false }
  }

  const acknowledgment = getAcknowledgment(data, assignment, studentId)
  const canAcknowledge = isGroupWork ? group.leaderId === studentId : true

  if (acknowledgment !== null) {
    return { state: 'acknowledged', acknowledgment, group, canAcknowledge }
  }

  return {
    state: isPast(assignment.deadline) ? 'overdue' : 'pending',
    acknowledgment: null,
    group,
    canAcknowledge,
  }
}

/* Progress */

/*
  Who is accounted for on one assignment and who is not, named rather than only counted.

  The subjects are students for individual work and groups for group work, which is the same rule the acknowledgment row itself follows. The professor's list and the student's button are therefore two readings of one idea rather than two rules that have to be kept in step.

  Walking the course's subjects rather than the assignment's rows also means the denominator is the course, so a row left behind by data that no longer belongs to the course cannot inflate the count.
*/
export function getAssignmentBreakdown(data, assignment) {
  const isGroupWork = assignment.submissionType === 'group'

  const subjects = isGroupWork
    ? getGroupsInCourse(data, assignment.courseId)
    : getStudentsInCourse(data, assignment.courseId)

  const done = []
  const waiting = []

  for (const subject of subjects) {
    const acknowledgment = findAcknowledgment(
      data,
      assignment.id,
      isGroupWork ? 'group' : 'student',
      subject.id,
    )

    const entry = { id: subject.id, name: subject.name, acknowledgment }

    if (acknowledgment === null) {
      waiting.push(entry)
    } else {
      done.push(entry)
    }
  }

  return { done, waiting }
}

/*
  How many have handed in, against the right denominator. For group work the denominator is the number of groups in the course, not the number of students, because one group hands in once.

  Counted off the same walk that produces the names, so the bar and the list under it can never tell the professor two different things.
*/
export function getAssignmentProgress(data, assignment) {
  const { done, waiting } = getAssignmentBreakdown(data, assignment)

  return toProgress(done.length, done.length + waiting.length)
}

/*
  Everything one student's view of one course needs, worked out in a single pass.

  The course card on the dashboard and the course page itself both read this, so the number on the card and the list behind it are the same answer rather than two answers that agree by luck.

  overdue is counted separately because it is the only thing on the dashboard worth interrupting somebody for.
*/
export function getCourseWorkForStudent(data, courseId, studentId) {
  const items = getAssignmentsForCourse(data, courseId).map((assignment) => ({
    assignment,
    status: getAssignmentStatusForStudent(data, assignment, studentId),
  }))

  const done = items.filter((item) => item.status.state === 'acknowledged').length
  const overdue = items.filter((item) => item.status.state === 'overdue').length

  return { items, progress: toProgress(done, items.length), overdue }
}

/*
  The professor's headline number for a course: of every submission expected across all its assignments, how many are in. Summing the parts rather than averaging the percentages, so an assignment with more students counts for more, which is what someone reading the card expects.
*/
export function getCourseProgress(data, courseId) {
  const assignments = getAssignmentsForCourse(data, courseId)

  let done = 0
  let total = 0

  for (const assignment of assignments) {
    const progress = getAssignmentProgress(data, assignment)
    done += progress.done
    total += progress.total
  }

  return toProgress(done, total)
}

function toProgress(done, total) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return { done, total, percent }
}

function byName(a, b) {
  return a.name.localeCompare(b.name)
}

function byDeadline(a, b) {
  return a.deadline.localeCompare(b.deadline)
}
