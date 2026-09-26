import { useState } from 'react'

const LABEL = 'block text-xs font-medium text-slate-700'
const INPUT =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent-500 focus:outline-none'
const ERROR = 'mt-1 text-xs text-amber-700'

/*
  Five pieces of state, one per field plus one object of error messages. No
  form library, because four fields and three rules do not need one.

  The parent closes this form once an assignment is made, which unmounts it, so
  the fields clear themselves. Same trick as the submission modal.
*/
export default function CreateAssignmentForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState({})

  function findErrors() {
    const found = {}

    if (title.trim() === '') {
      found.title = 'Give the assignment a title.'
    }

    if (dueDate === '') {
      found.dueDate = 'Pick a due date.'
    }

    if (driveLink.trim() === '') {
      found.driveLink = 'Add the Drive folder students should upload to.'
    } else if (!driveLink.trim().startsWith('http')) {
      found.driveLink = 'That does not look like a link. It should start with https.'
    }

    return found
  }

  /*
    An error clears the moment its own field changes, so a message never sits
    there complaining about something already fixed.
  */
  function clearError(field) {
    setErrors((current) => {
      if (current[field] === undefined) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const found = findErrors()
    setErrors(found)

    if (Object.keys(found).length > 0) {
      return
    }

    onCreate({
      title: title.trim(),
      description: description.trim(),
      driveLink: driveLink.trim(),
      dueDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="assignment-title" className={LABEL}>
          Title
        </label>
        <input
          id="assignment-title"
          type="text"
          value={title}
          placeholder="Operating Systems Case Study"
          onChange={(event) => {
            setTitle(event.target.value)
            clearError('title')
          }}
          className={INPUT}
        />
        {errors.title === undefined ? null : <p className={ERROR}>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="assignment-drive-link" className={LABEL}>
          Drive folder link
        </label>
        <input
          id="assignment-drive-link"
          type="url"
          value={driveLink}
          placeholder="https://drive.google.com/drive/folders/..."
          onChange={(event) => {
            setDriveLink(event.target.value)
            clearError('driveLink')
          }}
          className={INPUT}
        />
        {errors.driveLink === undefined ? null : <p className={ERROR}>{errors.driveLink}</p>}
      </div>

      <div>
        <label htmlFor="assignment-due-date" className={LABEL}>
          Due date
        </label>
        <input
          id="assignment-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => {
            setDueDate(event.target.value)
            clearError('dueDate')
          }}
          className={INPUT}
        />
        {errors.dueDate === undefined ? null : <p className={ERROR}>{errors.dueDate}</p>}
      </div>

      <div>
        <label htmlFor="assignment-description" className={LABEL}>
          Description
        </label>
        <textarea
          id="assignment-description"
          rows={3}
          value={description}
          placeholder="What should students hand in?"
          onChange={(event) => setDescription(event.target.value)}
          className={INPUT}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 sm:w-auto"
        >
          Create assignment
        </button>
      </div>
    </form>
  )
}
