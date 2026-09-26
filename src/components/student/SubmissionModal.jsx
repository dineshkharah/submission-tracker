import { useState } from 'react'
import { isWebLink } from '../../utils/validate'
import Modal from '../common/Modal'
import TextField from '../common/TextField'

/*
  The double verification flow.

  The work itself is uploaded to Google Drive, somewhere this app cannot see,
  so all it can do is record what the student tells it. Step one is where that
  claim gets something behind it: the student pastes a link to the work, and
  the step will not move on without one that parses as a web link. Step two
  shows them exactly what their professor is about to receive and asks them to
  accept that it cannot be taken back.

  The store is only touched on step two. Rolling both into a single click would
  put a claim the student cannot undo one accidental tap away, and would leave
  the professor with a status they have no way of checking.

  The link survives going back, because it is held here and step one is a
  different view of the same state rather than a different component.
*/
export default function SubmissionModal({ assignment, onClose, onConfirm }) {
  const [step, setStep] = useState('acknowledge')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  const isFirstStep = step === 'acknowledge'

  function handleContinue() {
    const trimmed = link.trim()

    if (trimmed === '') {
      setError('Paste the link to the work you uploaded.')
      return
    }

    if (!isWebLink(trimmed)) {
      setError('That does not look like a link. It should start with https.')
      return
    }

    setError('')
    setStep('confirm')
  }

  return (
    <Modal onClose={onClose} labelledBy="submission-modal-title">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        Step {isFirstStep ? '1' : '2'} of 2
      </p>

      {isFirstStep ? (
        <>
          <h2 id="submission-modal-title" className="mt-2 text-lg font-semibold text-slate-900">
            Where is your work?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Paste a link to what you uploaded for{' '}
            <span className="font-medium text-slate-900">{assignment.title}</span>. Your professor
            opens this to mark it, so check they are allowed to see it.
          </p>

          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Open the Drive folder
          </a>

          <div className="mt-4">
            <TextField
              id="submission-link"
              label="Link to your work"
              type="url"
              value={link}
              error={error}
              placeholder="https://drive.google.com/file/d/..."
              onChange={(event) => {
                setLink(event.target.value)
                setError('')
              }}
            />
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              Yes, I have submitted
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 id="submission-modal-title" className="mt-2 text-lg font-semibold text-slate-900">
            One last check
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            This marks <span className="font-medium text-slate-900">{assignment.title}</span> as
            submitted and gives your professor this link:
          </p>

          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs break-all text-slate-700">
            {link.trim()}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            You cannot undo this yourself, you would have to ask your professor.
          </p>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setStep('acknowledge')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Go back
            </button>

            <button
              type="button"
              onClick={() => onConfirm(link.trim())}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              Confirm submission
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
