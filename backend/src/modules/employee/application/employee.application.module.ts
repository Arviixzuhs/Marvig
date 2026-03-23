import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindEmployeeUseCase } from './usecases/find-employee.usecase'
import { FindEmployeesUseCase } from './usecases/find-employees.usecase'
import { CreateEmployeeUseCase } from './usecases/create-employee.usecase'
import { UpdateEmployeeUseCase } from './usecases/update-employee.usecase'
import { DeleteEmployeeUseCase } from './usecases/delete-employee.usecase'
import { PrismaEmployeeRepositoryAdapter } from '@/modules/employee/infrastructure/repositories/prisma.employee.repository.adapter'

config()
@Module({
  imports: [],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      }),
    },
    FindEmployeeUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    FindEmployeesUseCase,
    CreateEmployeeUseCase,
    {
      provide: 'EmployeeRepository',
      useClass: PrismaEmployeeRepositoryAdapter,
    },
  ],
  exports: [
    FindEmployeeUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    FindEmployeesUseCase,
    CreateEmployeeUseCase,
  ],
})
export class EmployeeApplicationModule {}
