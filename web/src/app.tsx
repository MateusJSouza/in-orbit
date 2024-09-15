import { useQuery } from '@tanstack/react-query'
import { EmptyGoals } from './components/empty-goals'
import { Dialog } from './components/ui/dialog'
import { getSummary } from './http/get-summary'
import { Loader2 } from 'lucide-react'
import { CreateGoal } from './components/create-goal'
import { Summary } from './components/summary'

export function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
  })

  if (isLoading || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="text-zinc-500 animate-spin size-10" />
      </div>
    )
  }

  return (
    <Dialog>
      {data.summary.total > 0 ? <Summary /> : <EmptyGoals />}

      {/* <EmptyGoals /> */}

      <CreateGoal />
    </Dialog>
  )
}
