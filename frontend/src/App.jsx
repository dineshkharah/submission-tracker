import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from './hooks/useData'

/*
  A holding screen for one milestone. The real routes and the login screen arrive next, and this goes with them.

  It earns its place for now by reading the store the same way every real screen will, so if the seed files or the provider were wrong this page would say so rather than the app failing silently later.
*/
export default function App() {
  const data = useData()

  const collections = [
    ['Users', data.users.length],
    ['Courses', data.courses.length],
    ['Enrollments', data.enrollments.length],
    ['Groups', data.groups.length],
    ['Group members', data.groupMembers.length],
    ['Assignments', data.assignments.length],
    ['Acknowledgments', data.acknowledgments.length],
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Data layer</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            Loaded from the seed files and saved to localStorage. The screens are built next.
          </p>

          <dl className="divide-border divide-y text-sm">
            {collections.map(([label, count]) => (
              <div key={label} className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{count}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
