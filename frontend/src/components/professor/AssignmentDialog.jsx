import { Pencil, Plus } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '../../hooks/useAuth'
import { useData } from '../../hooks/useData'
import { fromLocalInput, isPast, toLocalInput } from '../../utils/format'
import { isWebLink } from '../../utils/validate'
import Field from '../common/Field'

const EMPTY = {
  title: '',
  description: '',
  oneDriveLink: '',
  deadline: '',
  submissionType: 'individual',
}

/*
  Creating and editing are the same form, because they ask for exactly the same five things. Splitting them would mean writing the validation twice and then keeping the two copies in step, which is the kind of duplication that quietly drifts.
*/
function fieldsFrom(assignment) {
  if (assignment === null) {
    return EMPTY
  }

  return {
    title: assignment.title,
    description: assignment.description,
    oneDriveLink: assignment.oneDriveLink,
    deadline: toLocalInput(assignment.deadline),
    submissionType: assignment.submissionType,
  }
}

/*
  locked is passed in by the caller, which already knows whether anybody has acknowledged this assignment. It stops the submission type being changed after the fact, and that rule is worth stating plainly: an acknowledgment row points at a student for individual work and at a group for group work, so flipping the type would leave every answer already given pointing at the wrong kind of thing. The rest of the assignment stays editable, since a clearer description or a later deadline breaks nothing.
*/
export default function AssignmentDialog({ courseId, assignment = null, locked = false }) {
  const { createAssignment, updateAssignment } = useData()
  const { currentUser } = useAuth()

  const isEdit = assignment !== null

  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(() => fieldsFrom(assignment))
  const [errors, setErrors] = useState({})

  function handleOpenChange(next) {
    setOpen(next)

    if (next) {
      setFields(fieldsFrom(assignment))
      setErrors({})
    }
  }

  function set(name, value) {
    setFields((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (current[name] === undefined) {
        return current
      }

      const rest = { ...current }
      delete rest[name]
      return rest
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const found = {}

    if (fields.title.trim() === '') {
      found.title = 'Give the assignment a title.'
    }

    if (fields.description.trim() === '') {
      found.description = 'Say what students have to do.'
    }

    if (fields.oneDriveLink.trim() === '') {
      found.oneDriveLink = 'Add the OneDrive folder for this assignment.'
    } else if (!isWebLink(fields.oneDriveLink)) {
      found.oneDriveLink = 'That is not a web address. It should start with http or https.'
    }

    /*
      A new assignment cannot be due in the past, because nobody could hand it in. An existing one can, since a deadline that has already gone by is a normal thing to be editing the wording of.
    */
    if (fields.deadline === '') {
      found.deadline = 'Set a deadline.'
    } else if (!isEdit && isPast(fromLocalInput(fields.deadline))) {
      found.deadline = 'The deadline has already gone by. Pick a date in the future.'
    }

    setErrors(found)

    if (Object.keys(found).length > 0) {
      return
    }

    const values = {
      title: fields.title.trim(),
      description: fields.description.trim(),
      oneDriveLink: fields.oneDriveLink.trim(),
      deadline: fromLocalInput(fields.deadline),
      submissionType: fields.submissionType,
    }

    if (isEdit) {
      updateAssignment(assignment.id, values)
      toast.success('Assignment updated', { description: values.title })
    } else {
      createAssignment({ ...values, courseId, createdBy: currentUser.id })
      toast.success('Assignment created', { description: values.title })
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="sm">
            <Pencil />
            Edit
          </Button>
        ) : (
          <Button>
            <Plus />
            New assignment
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit assignment' : 'New assignment'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Students see these changes straight away.'
                : 'Everyone enrolled on this course will see it as soon as you save.'}
            </DialogDescription>
          </DialogHeader>

          <Field id="title" label="Title" error={errors.title}>
            <Input
              id="title"
              value={fields.title}
              placeholder="Process Scheduling Report"
              onChange={(event) => set('title', event.target.value)}
            />
          </Field>

          <Field id="description" label="Description" error={errors.description}>
            <Textarea
              id="description"
              rows={3}
              value={fields.description}
              placeholder="What you want them to hand in, and what it is marked on."
              onChange={(event) => set('description', event.target.value)}
            />
          </Field>

          <Field id="link" label="OneDrive link" error={errors.oneDriveLink}>
            <Input
              id="link"
              value={fields.oneDriveLink}
              placeholder="https://1drv.ms/..."
              onChange={(event) => set('oneDriveLink', event.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="deadline" label="Deadline" error={errors.deadline}>
              <Input
                id="deadline"
                type="datetime-local"
                value={fields.deadline}
                onChange={(event) => set('deadline', event.target.value)}
              />
            </Field>

            <Field
              id="type"
              label="Submission type"
              hint={locked ? 'Locked, because this has already been acknowledged.' : undefined}
            >
              <Select
                value={fields.submissionType}
                disabled={locked}
                onValueChange={(value) => set('submissionType', value)}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Save changes' : 'Create assignment'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
