import { useEffect, useState } from 'react'
import seedAssignments from '../data/assignments.json'
import seedSubmissions from '../data/submissions.json'
import seedUsers from '../data/users.json'
import { STORAGE_KEYS, load, save } from '../utils/storage'
import { DataContext } from './dataContext'

/*
  The seed files are the starting point, never the live data. They get copied
  into state on first run and localStorage takes over from there. Copying the
  arrays keeps the imported modules read only, so a mistake anywhere else in
  the app cannot quietly change what a reset restores to.
*/
function makeSeedData() {
  return {
    users: [...seedUsers],
    assignments: [...seedAssignments],
    submissions: [...seedSubmissions],
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => load(STORAGE_KEYS.data, makeSeedData()))

  useEffect(() => {
    save(STORAGE_KEYS.data, data)
  }, [data])

  function markSubmitted(assignmentId, studentId, submissionLink) {
    setData((current) => ({
      ...current,
      submissions: current.submissions.map((submission) => {
        const isTheOne =
          submission.assignmentId === assignmentId && submission.studentId === studentId

        if (!isTheOne) {
          return submission
        }

        return {
          ...submission,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          submissionLink,
        }
      }),
    }))
  }

  /*
    Creating an assignment also creates one submission row per student, all of
    them not_submitted. That is what gives the professor a denominator for the
    progress bar and a list of names to chase from the moment the assignment
    exists, rather than only once somebody has submitted something.
  */
  function createAssignment({ title, description, driveLink, dueDate, createdBy }) {
    const assignmentId = `a-${Date.now()}`

    const assignment = {
      id: assignmentId,
      title,
      description,
      driveLink,
      createdBy,
      dueDate,
      createdAt: new Date().toISOString(),
    }

    setData((current) => {
      const students = current.users.filter((user) => user.role === 'student')

      const blankRows = students.map((student) => ({
        id: `sub-${assignmentId}-${student.id}`,
        assignmentId,
        studentId: student.id,
        status: 'not_submitted',
        submittedAt: null,
        submissionLink: null,
      }))

      return {
        ...current,
        assignments: [assignment, ...current.assignments],
        submissions: [...current.submissions, ...blankRows],
      }
    })
  }

  function resetData() {
    setData(makeSeedData())
  }

  const value = { ...data, markSubmitted, createAssignment, resetData }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
