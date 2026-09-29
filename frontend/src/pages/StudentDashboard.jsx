import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../hooks/useAuth'

/*
  A holding screen for one milestone. The enrolled course cards and their progress arrive next.
*/
export default function StudentDashboard() {
  const { currentUser } = useAuth()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your courses</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          Signed in as {currentUser.name}. The course cards are built next.
        </p>
      </CardContent>
    </Card>
  )
}
