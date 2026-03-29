import { Injectable } from '@nestjs/common'
import { ExpenseDto } from '@/modules/expense/application/dto/expense.dto'
import { ExpensePage } from '@/modules/expense/application/dto/expense-page.dto'
import { PrismaClient } from 'generated/prisma/client'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { UpdateExpenseDto } from '@/modules/expense/application/dto/update-expense.dto'
import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { ExpenseRepositoryPort } from '@/modules/expense/domain/repositories/expense.repository.port'
import { ExpenseSpecificationBuilder } from './prisma.expense.specificationBuilder'

@Injectable()
export class PrismaExpenseRepositoryAdapter implements ExpenseRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createExpense(data: ExpenseDto): Promise<ExpenseModel> {
    const createdExpense = await this.prisma.expense.create({
      data: {
        ...data,
      },
      include: {
        apartment: true,
        employee: true,
      },
    })
    return createdExpense
  }

  async findExpenses(filters: ExpenseFilterDto): Promise<ExpensePage> {
    const query = new ExpenseSpecificationBuilder()
      .withSearch(filters.search)
      .withApartment(filters.apartmentId)
      .withEmployee(filters.employeeId)
      .withCategory(filters.category)
      .withIsDeleted(false)
      .withAmountBetween(filters.minAmount, filters.maxAmount)
      .withDateBetween(filters.fromDate, filters.toDate)
      .withPagination(filters.page, filters.pageSize)
      .withOrderBy({ createdAt: 'desc' })
      .build()

    const [expenses, expensesCount] = await this.prisma.$transaction([
      this.prisma.expense.findMany({
        ...query,
        include: {
          apartment: true,
          employee: true,
        },
      }),
      this.prisma.expense.count({
        where: query.where,
      }),
    ])

    return {
      content: expenses,
      totalPages: Math.ceil(expensesCount / query.take),
      totalItems: expensesCount,
      currentPage: filters.page,
      rowsPerPage: query.take,
    }
  }

  async findExpensesByApartment(apartmentId: number): Promise<ExpenseModel[]> {
    const expenses = await this.prisma.expense.findMany({
      where: {
        apartmentId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    })
    return expenses
  }

  async findExpense(expenseId: number): Promise<ExpenseModel> {
    const expense = await this.prisma.expense.findUnique({
      where: {
        id: expenseId,
        isDeleted: false,
      },
      include: {
        apartment: true,
        employee: true,
      },
    })
    return expense
  }

  async updateExpense(expenseId: number, newData: UpdateExpenseDto): Promise<ExpenseModel> {
    const updatedExpense = await this.prisma.expense.update({
      where: {
        id: expenseId,
        isDeleted: false,
      },
      data: newData,
      include: {
        apartment: true,
        employee: true,
      },
    })
    return updatedExpense
  }

  async deleteExpense(expenseId: number): Promise<void> {
    await this.prisma.expense.update({
      where: {
        id: expenseId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })
  }

  async existsExpenseById(id: number): Promise<boolean> {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    })
    return !!expense
  }
}
