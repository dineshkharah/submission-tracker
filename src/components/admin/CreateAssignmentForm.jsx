import { useState } from 'react'
import { todayAsText } from '../../utils/format'
import { isWebLink } from '../../utils/validate'
import TextField from '../common/TextField'

const TITLE_LIMIT = 120
const DESCRIPTION_LIMIT = 500

/*
  Five pieces of state, one per field plus one object of error messages. No
  form library, because four fields and four rules do not need one.

  The parent closes this form once an assignment is made, which unmounts it, so
  the fields clear themselves. Same trick as the submission modal.
*/
export default function CreateAssignmentForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState({})

  const today = todayAsText()

  function findErrors() {
    const found = {}

    if (title.trim() === '') {
      found.title = 'Give the assignment a title.'
    }

    if (dueDate === '') {
      found.dueDate = 'Pick a due date.'
    } else if (dueDate < today) {
      found.dueDate = 'The due date cannot be in the past.'
    }

    if (driveLink.trim() === '') {
      found.driveLink = 'Add the Drive folder students should upload to.'
    } else if (!isWebLink(driveLink.trim())) {
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
      <TextField
        id="assignment-title"
        label="Title"
        value={title}
        error={errors.title}
        maxLength={TITLE_LIMIT}
        placeholder="Operating Systems Case Study"
        onChange={(event) => {
          setTitle(event.target.value)
          clearError('title')
        }}
      />

      <TextField
        id="assignment-drive-link"
        label="Drive folder link"
        type="url"
        value={driveLink}
        error={errors.driveLink}
        placeholder="https://drive.google.com/drive/folders/..."
        onChange={(event) => {
          setDriveLink(event.target.value)
          clearError('driveLink')
        }}
      />

      {/*
        min stops the date picker offering a past day at all. The check in
        findErrors still has to exist, because min is only a hint and a typed
        date goes straight past it.
      */}
      <TextField
        id="assignment-due-date"
        label="Due date"
        type="date"
        value={dueDate}
        error={errors.dueDate}
        min={today}
        onChange={(event) => {
          setDueDate(event.target.value)
          clearError('dueDate')
        }}
      />

      <TextField
        id="assignment-description"
        label="Description"
        multiline
        rows={3}
        value={description}
        maxLength={DESCRIPTION_LIMIT}
        placeholder="What should students hand in?"
        hint={`Optional. ${DESCRIPTION_LIMIT - description.length} characters left.`}
        onChange={(event) => setDescription(event.target.value)}
      />

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
