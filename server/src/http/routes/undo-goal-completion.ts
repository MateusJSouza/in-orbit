import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { undoWeekGoalCompletion } from '../../functions/undo-goal-completion'

export const undoWeekGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  const handler = async (
    request: FastifyRequest<{ Params: { goalId: string } }>,
    reply: FastifyReply
  ) => {
    const { goalId } = request.params

    try {
      const result = await undoWeekGoalCompletion(goalId)

      // Sempre retorna 200, mas inclui o status de sucesso no payload
      return reply.status(200).send({
        ...result,
      })
    } catch (error) {
      console.error('Erro ao desfazer a conclusão da meta da semana:', error)
      return reply.status(500).send({
        success: false,
        message: 'Erro interno ao desfazer a conclusão da meta da semana',
        goalId,
      })
    }
  }

  const schema = {
    params: z.object({
      goalId: z.string(),
    }),
  }

  app.post<{ Params: { goalId: string } }>(
    '/goals/:goalId/undo-week-goal-completion',
    { schema },
    handler
  )
}
