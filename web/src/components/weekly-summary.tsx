import { CheckCircle2, Plus } from 'lucide-react'
import { InOrbitIcon } from './in-orbit-icon'
import { Button } from './ui/button'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { PendingGoals } from './pending-goals'
import type { GetSummaryResponse } from '../http/get-summary'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { DialogTrigger } from './ui/dialog'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { undoGoalCompletion } from '../http/undo-goal'
import { toast } from 'sonner'

dayjs.locale('pt-br')

interface WeeklySummaryProps {
  summary: GetSummaryResponse['summary']
}

export function WeeklySummary({ summary }: WeeklySummaryProps) {
  const queryClient = new QueryClient()

  const undoGoalMutation = useMutation({
    mutationFn: undoGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      toast.success('Meta desfeita com sucesso!')
    },
    onError: () => {
      toast.error('Falha ao desfazer meta')
    },
  })

  function handleUndoGoal(goalId: string) {
    console.log('Tentando desfazer meta com ID:', goalId)
    undoGoalMutation.mutate({ goalId })
  }

  const fromDate = dayjs().startOf('week').format('D[ de ]MMM')
  const toDate = dayjs().endOf('week').format('D[ de ]MMM')

  const completedPercentage = Math.round(
    (summary.completed * 100) / summary.total
  )

  if (!summary) return null

  return (
    <main className="max-w-[540px] py-10 px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold">
            {fromDate} - {toDate}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={summary.completed} max={summary.total}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{summary.completed}</span> de{' '}
            <span className="text-zinc-100">{summary.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Sua semana</h2>

        {summary.goalsPerDay && Object.keys(summary.goalsPerDay).length > 0 ? (
          Object.entries(summary.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const parsedDate = dayjs(date).format('D[ de ]MMM')

            return (
              <div className="space-y-4" key={date}>
                <h3 className="font-medium">
                  <span className="capitalize">{weekDay}</span>{' '}
                  <span className="text-zinc-400 text-xs">({parsedDate})</span>
                </h3>

                <ul className="space-y-3">
                  {goals.map(goal => {
                    const parsedTime = dayjs(goal.createdAt).format('HH:mm[h]')

                    return (
                      <li className="flex items-center gap-2" key={goal.id}>
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às <span className="text-zinc-100">{parsedTime}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUndoGoal(goal.id)}
                          className="text-zinc-500 underline text-xs"
                        >
                          Desfazer
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        ) : (
          <p>Nenhuma meta completada esta semana.</p>
        )}
      </div>
    </main>
  )
}
