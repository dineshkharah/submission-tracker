import { CalendarClock, ExternalLink, Lock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '../../hooks/useAuth'
import { useData } from '../../hooks/useData'
import { formatDateTime } from '../../utils/format'
import { getGroupMembers, getUserById } from '../../utils/selectors'
import StatusBadge from '../common/StatusBadge'
import AcknowledgeDialog from './AcknowledgeDialog'

/*
  One assignment as a student sees it. The card is the same for individual and group work, and everything that differs is decided by the status object rather than by the card asking questions about submission types.

  The bottom of the card is the only part that changes, and it has exactly four shapes: the leader or an individual student gets the button, a member gets told who is handing in, somebody with no group gets the prompt, and anybody already acknowledged gets the record of it. Keeping those four together in one place is what stops a fifth case appearing by accident somewhere else.
*/
export default function AssignmentCard({ assignment, status }) {
  const data = useData()
  const { currentUser } = useAuth()

  const isGroupWork = assignment.submissionType === 'group'
  const members = status.group === null ? [] : getGroupMembers(data, status.group.id)

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{isGroupWork ? 'Group' : 'Individual'}</Badge>
          <StatusBadge state={status.state} />
        </div>

        <CardTitle>{assignment.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{assignment.description}</p>

        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
          <span
            className={`flex items-center gap-1.5 ${status.state === 'overdue' ? 'text-overdue font-medium' : 'text-muted-foreground'}`}
          >
            <CalendarClock className="size-4 shrink-0" />
            Due {formatDateTime(assignment.deadline)}
          </span>

          <a
            href={assignment.oneDriveLink}
            target="_blank"
            rel="noreferrer"
            className="text-primary flex w-fit items-center gap-1.5 font-medium hover:underline"
          >
            <ExternalLink className="size-4 shrink-0" />
            Assignment folder
          </a>

          {status.group !== null ? (
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Users className="size-4 shrink-0" />
              {status.group.name}, {members.length} members
            </span>
          ) : null}
        </div>

        <Separator />

        <Action
          assignment={assignment}
          status={status}
          members={members}
          currentUserId={currentUser.id}
          data={data}
        />
      </CardContent>
    </Card>
  )
}

function Action({ assignment, status, members, currentUserId, data }) {
  /*
    Quoted word for word from the task, because it is the one sentence somebody with no group is meant to read. Groups are seeded rather than formed in the interface, so the prompt says what to do without offering a button that would not work.
  */
  if (status.state === 'no_group') {
    return (
      <p className="bg-secondary rounded-lg p-3 text-sm">
        You are not part of any group. Form or join one to submit this assignment.
      </p>
    )
  }

  if (status.state === 'acknowledged') {
    const who = getUserById(data, status.acknowledgment.acknowledgedBy)
    const isMine = status.acknowledgment.acknowledgedBy === currentUserId

    return (
      <div className="bg-success/5 border-success/20 space-y-2 rounded-lg border p-3 text-sm">
        <p>
          <span className="text-success font-medium">
            {isMine ? 'You acknowledged this' : `${who.name} acknowledged this`}
          </span>{' '}
          on {formatDateTime(status.acknowledgment.acknowledgedAt)}
        </p>

        <a
          href={status.acknowledgment.submissionLink}
          target="_blank"
          rel="noreferrer"
          className="text-primary flex w-fit items-center gap-1.5 font-medium hover:underline"
        >
          <ExternalLink className="size-4 shrink-0" />
          Submitted work
        </a>
      </div>
    )
  }

  /*
    A member of a group with nothing handed in yet. The reason is named rather than left as a button that does nothing, and the leader is named so they know who to go and ask.
  */
  if (!status.canAcknowledge) {
    const leader = getUserById(data, status.group.leaderId)

    return (
      <p className="text-muted-foreground flex items-start gap-2 text-sm">
        <Lock className="mt-0.5 size-4 shrink-0" />
        <span>
          <span className="text-foreground font-medium">{leader.name}</span> leads{' '}
          {status.group.name} and hands this in for everyone. It will show as acknowledged here as
          soon as they do.
        </span>
      </p>
    )
  }

  return (
    <AcknowledgeDialog
      assignment={assignment}
      group={status.group}
      memberCount={members.length}
    />
  )
}
