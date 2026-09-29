import { useEffect, useState } from 'react'
import seedAcknowledgments from '../data/acknowledgments.json'
import seedAssignments from '../data/assignments.json'
import seedCourses from '../data/courses.json'
import seedEnrollments from '../data/enrollments.json'
import seedGroupMembers from '../data/groupMembers.json'
import seedGroups from '../data/groups.json'
import seedUsers from '../data/users.json'
import { STORAGE_KEYS, load, save } from '../utils/storage'
import { getAssignmentById, getAssignmentStatusForStudent } from '../utils/selectors'
import { DataContext } from './dataContext'

/*
  The seed files are the starting point, never the live data. They are copied into state on first run and localStorage takes over from there. Copying the arrays keeps the imported modules read only, so a mistake elsewhere cannot quietly change what a reset restores to.
*/
function makeSeedData() {
  return {
    users: [...seedUsers],
    courses: [...seedCourses],
    enrollments: [...seedEnrollments],
    groups: [...seedGroups],
    groupMembers: [...seedGroupMembers],
    assignments: [...seedAssignments],
    acknowledgments: [...seedAcknowledgments],
  }
}

function initialsFrom(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => load(STORAGE_KEYS.data, makeSeedData()))

  useEffect(() => {
    save(STORAGE_KEYS.data, data)
  }, [data])

  /*
    The one write that matters.

    Which subject the row points at comes from the assignment's type, not from the caller, so a component cannot ask for the wrong kind. Whether this person is allowed to write at all is decided by getAssignmentStatusForStudent, the same function the button uses to decide whether to render itself. The permission rule therefore exists once, and the screen and the store can never disagree about it.

    A member of a group gets canAcknowledge false and this returns unchanged state, so there is no path from a member's session to a written row.
  */
  function acknowledge(assignmentId, studentId, submissionLink) {
    setData((current) => {
      const assignment = getAssignmentById(current, assignmentId)

      if (assignment === null) {
        return current
      }

      const status = getAssignmentStatusForStudent(current, assignment, studentId)

      if (!status.canAcknowledge || status.state === 'acknowledged') {
        return current
      }

      const isGroupWork = assignment.submissionType === 'group'

      const row = {
        id: `ack-${Date.now()}`,
        assignmentId,
        subjectType: isGroupWork ? 'group' : 'student',
        subjectId: isGroupWork ? status.group.id : studentId,
        acknowledgedBy: studentId,
        acknowledgedAt: new Date().toISOString(),
        submissionLink,
      }

      return { ...current, acknowledgments: [...current.acknowledgments, row] }
    })
  }

  /*
    Round 1 created a blank submission row for every student the moment an assignment existed, because there was no enrollment table and the professor needed a denominator for the progress bar.

    Round 2 has enrollments and groups, so the denominator is worked out from those instead and no rows are created here at all. A row now means somebody actually handed something in.
  */
  function createAssignment(fields) {
    const now = new Date().toISOString()

    const assignment = {
      id: `a-${Date.now()}`,
      courseId: fields.courseId,
      title: fields.title,
      description: fields.description,
      oneDriveLink: fields.oneDriveLink,
      deadline: fields.deadline,
      submissionType: fields.submissionType,
      createdBy: fields.createdBy,
      createdAt: now,
      updatedAt: now,
    }

    setData((current) => ({
      ...current,
      assignments: [assignment, ...current.assignments],
    }))
  }

  function updateAssignment(assignmentId, fields) {
    setData((current) => ({
      ...current,
      assignments: current.assignments.map((assignment) => {
        if (assignment.id !== assignmentId) {
          return assignment
        }

        return { ...assignment, ...fields, updatedAt: new Date().toISOString() }
      }),
    }))
  }

  /*
    Registration adds a user and hands it straight back, so the auth context can issue a token for it without waiting for a re render. The caller checks for a duplicate email first, because that needs to surface as a field error on the form rather than a silent refusal here.
  */
  function registerUser({ name, email, password, role }) {
    const user = {
      id: `u-${role === 'professor' ? 'prof' : 'stu'}-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      initials: initialsFrom(name),
      password,
    }

    setData((current) => ({ ...current, users: [...current.users, user] }))

    return user
  }

  function resetData() {
    setData(makeSeedData())
  }

  const value = {
    ...data,
    acknowledge,
    createAssignment,
    updateAssignment,
    registerUser,
    resetData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
