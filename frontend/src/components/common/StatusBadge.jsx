import { AlertTriangle, CheckCircle2, Clock, UserMinus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

/*
  One place decides what a status looks like, so green means acknowledged everywhere in the app and cannot come to mean something else on a screen somebody wrote later.

  Each state carries an icon as well as a colour, because roughly one man in twelve cannot tell the green apart from the red and a badge that only says its meaning in colour says nothing to them.

  The states are the ones getAssignmentStatusForStudent returns, so a new state has to be given a look here before it can reach a screen.
*/
const LOOK = {
  acknowledged: { label: 'Acknowledged', icon: CheckCircle2, className: 'bg-success text-white' },
  pending: { label: 'Pending', icon: Clock, className: 'bg-pending text-white' },
  overdue: { label: 'Overdue', icon: AlertTriangle, className: 'bg-overdue text-white' },
  no_group: {
    label: 'No group',
    icon: UserMinus,
    className: 'bg-secondary text-secondary-foreground',
  },
}

export default function StatusBadge({ state }) {
  const look = LOOK[state]
  const Icon = look.icon

  return (
    <Badge className={look.className}>
      <Icon />
      {look.label}
    </Badge>
  )
}
