import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ExpenseImageDto } from '@/modules/expense/application/dto/expense-image.dto'
import { ExpenseImageModel } from '@/modules/expense/domain/models/expense-image.model'
import { ExpenseImageRepositoryPort } from '@/modules/expense/domain/repositories/expense-image.repository.port'

@Injectable()
export class PrismaExpenseImageRepositoryAdapter implements ExpenseImageRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createImages(data: ExpenseImageDto): Promise<void> {
    await this.prisma.expenseImage.createMany({
      data: data.imageUrls.map((url) => ({
        url,
        expenseId: data.id,
      })),
    })
  }

  async deleteImagesByExpense(expenseId: number): Promise<void> {
    await this.prisma.expenseImage.deleteMany({
      where: {
        expenseId,
      },
    })
  }

  async getImagesByExpense(expenseId: number): Promise<ExpenseImageModel[]> {
    return await this.prisma.expenseImage.findMany({
      where: { expenseId },
      orderBy: { id: 'asc' },
    })
  }
}
