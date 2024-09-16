export interface UndoGoalRequest {
  goalId: string
}

export async function undoGoalCompletion({
  goalId,
}: UndoGoalRequest): Promise<void> {
  console.log('Enviando requisição para desfazer meta com ID:', goalId)

  const response = await fetch(
    `http://localhost:3333/goals/${goalId}/undo-week-goal-completion`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goalId,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    if (
      data.message ===
      'Nenhuma conclusão encontrada para esta meta na semana atual'
    ) {
      throw new Error('Meta já desfeita ou não concluída nesta semana')
    }
    throw new Error(
      `Erro ao desfazer a conclusão da meta: ${response.status} ${response.statusText}. ${JSON.stringify(data)}`
    )
  }
}
