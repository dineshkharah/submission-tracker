import { useEffect } from 'react'

/*
  The parent decides whether this is on screen by rendering it or not, rather
  than through an open prop. Closing therefore unmounts it, and any state held
  inside it resets on its own without a line of cleanup code.

  It sits on the bottom edge on a phone, the way a sheet does, and centres
  itself from the sm breakpoint up.
*/
export default function Modal({ onClose, labelledBy, children }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl sm:p-6"
      >
        {children}
      </div>
    </div>
  )
}
