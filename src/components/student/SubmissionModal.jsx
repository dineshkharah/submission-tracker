import { useState } from 'react'
import Modal from '../common/Modal'

/*
  The double verification flow.

  The work itself is uploaded to Google Drive, somewhere this app cannot see,
  so all it can do is record a claim it has no way to check. Step one asks the
  student to go and check a fact about the world outside the app. Step two asks
  them to accept what recording that claim costs them.

  The store is only touched on step two. Rolling both into a single click would
  put an unverifiable claim that the student cannot undo one accidental tap
  away.
*/
export default function SubmissionModal({ assignment, onClose, onConfirm }) {
  const [step, setStep] = useState('acknowledge')

  const isFirstStep = step === 'acknowledge'

  return (
    <Modal onClose={onClose} labelledBy="submission-modal-title">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        Step {isFirstStep ? '1' : '2'} of 2
      </p>

      {isFirstStep ? (
        <>
          <h2 id="submission-modal-title" className="mt-2 text-lg font-semibold text-slate-900">
            Have you uploaded your work?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Check the Drive folder for{' '}
            <span className="font-medium text-slate-900">{assignment.title}</span> before you
            confirm. This app records what you tell it, it cannot see your folder.
          </p>

          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Open the Drive folder
          </a>

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
              onClick={() => setStep('confirm')}
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
            This marks{' '}
            <span className="font-medium text-slate-900">{assignment.title}</span> as submitted.
            You cannot undo it yourself, you would have to ask your professor.
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
              onClick={onConfirm}
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
