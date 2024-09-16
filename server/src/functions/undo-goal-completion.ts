import { db } from '../db'
import { goalCompletions } from '../db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export async function undoWeekGoalCompletion(goalId: string) {
  try {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))

    console.log('Desfazendo conclusão para goalId:', goalId)
    console.log('Início da semana:', startOfWeek)
    console.log('Fim da semana:', endOfWeek)

    // Verifica se existe uma conclusão para esta meta na semana atual
    const existingCompletion = await db
      .select()
      .from(goalCompletions)
      .where(
        and(
          eq(goalCompletions.goalId, goalId),
          gte(goalCompletions.createdAt, startOfWeek),
          lte(goalCompletions.createdAt, endOfWeek)
        )
      )
      .execute()

    console.log('Conclusões encontradas:', existingCompletion.length)

    if (existingCompletion.length === 0) {
      return {
        success: false,
        message: 'Nenhuma conclusão encontrada para esta meta na semana atual',
      }
    }

    // Remove a conclusão da meta da semana atual
    const deletedCompletion = await db
      .delete(goalCompletions)
      .where(
        and(
          eq(goalCompletions.goalId, goalId),
          gte(goalCompletions.createdAt, startOfWeek),
          lte(goalCompletions.createdAt, endOfWeek)
        )
      )
      .returning()
      .execute()

    console.log('Conclusões removidas:', deletedCompletion.length)

    return {
      success: true,
      message: 'Conclusão da meta da semana desfeita com sucesso',
    }
  } catch (error) {
    console.error('Erro ao desfazer a conclusão da meta da semana:', error)
    throw error
  }
}
