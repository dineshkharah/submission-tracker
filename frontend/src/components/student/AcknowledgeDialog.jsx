import { CheckCircle2, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../hooks/useAuth'
import { useData } from '../../hooks/useData'
import { formatDateTime } from '../../utils/format'
import { isWebLink } from '../../utils/validate'
import Field from '../common/Field'

/*
  Acknowledging is two steps on purpose, and the two steps do different jobs.

  An acknowledgment is a claim about work that lives somewhere else, so the first step makes somebody produce the evidence rather than simply asserting they are finished. The second step puts that evidence back in front of them before it becomes a record. Between them they make this hard to do by accident, which matters for something that cannot be undone.

  The dialog only ever renders where getAssignmentStatusForStudent said canAcknowledge, and the store checks the same rule again before writing. A group member therefore never sees this and could not write a row if they did.
*/
export default function AcknowledgeDialog({ assignment, group, memberCount }) {
  const { currentUser } = useAuth()
  const { acknowledge } = useData()

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('link')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  const isGroupWork = group !== null

  /*
    Closing resets everything, so reopening starts at the first step with an empty field instead of showing whatever was abandoned last time.
  */
  function handleOpenChange(next) {
    setOpen(next)

    if (!next) {
      setStep('link')
      setLink('')
      setError('')
    }
  }

  function handleContinue(event) {
    event.preventDefault()

    if (link.trim() === '') {
      setError('Add a link to the work you are handing in.')
      return
    }

    if (!isWebLink(link)) {
      setError('That is not a web address. It should start with http or https.')
      return
    }

    setError('')
    setStep('confirm')
  }

  function handleConfirm() {
    acknowledge(assignment.id, currentUser.id, link.trim())

    toast.success(
      isGroupWork ? `Acknowledged for ${group.name}` : 'Acknowledged',
      { description: assignment.title },
    )

    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <CheckCircle2 />
          {isGroupWork ? 'Acknowledge for the group' : 'Acknowledge submission'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {step === 'link' ? (
          <form onSubmit={handleContinue} noValidate className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Acknowledge submission</DialogTitle>
              <DialogDescription>{assignment.title}</DialogDescription>
            </DialogHeader>

            {isGroupWork ? <GroupNotice group={group} memberCount={memberCount} /> : null}

            <Field
              id="submission-link"
              label="Link to your work"
              error={error}
              hint="Paste the link to the file or folder you have handed in."
            >
              <Input
                id="submission-link"
                value={link}
                placeholder="https://1drv.ms/..."
                onChange={(event) => {
                  setLink(event.target.value)
                  setError('')
                }}
              />
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Confirm submission</DialogTitle>
              <DialogDescription>{assignment.title}</DialogDescription>
            </DialogHeader>

            {isGroupWork ? <GroupNotice group={group} memberCount={memberCount} /> : null}

            <div className="border-border grid gap-3 rounded-lg border p-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Your link</p>
                <p className="mt-0.5 break-all">{link.trim()}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Deadline</p>
                <p className="mt-0.5">{formatDateTime(assignment.deadline)}</p>
              </div>
            </div>

            <p className="text-muted-foreground text-xs">
              Your professor sees this as handed in straight away. It cannot be undone.
            </p>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep('link')}>
                Back
              </Button>
              <Button type="button" onClick={handleConfirm}>
                Confirm submission
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/*
  Shown on both steps for group work, because the one thing a leader should not be able to miss is that they are answering for other people.
*/
function GroupNotice({ group, memberCount }) {
  return (
    <p className="bg-secondary flex items-start gap-2 rounded-lg p-3 text-sm">
      <Users className="mt-0.5 size-4 shrink-0" />
      <span>
        You are handing in for <span className="font-medium">{group.name}</span>. All {memberCount}{' '}
        members will see this assignment as acknowledged.
      </span>
    </p>
  )
}
