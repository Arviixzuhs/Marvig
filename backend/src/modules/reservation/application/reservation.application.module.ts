import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindReservationUseCase } from './usecases/find-reservation.usecase'
import { CreateReservationUseCase } from './usecases/create-reservation.usecase'
import { FindReservationsUseCase } from './usecases/find-reservations.usecase'
import { UpdateReservationUseCase } from './usecases/update-reservation.usecase'
import { DeleteReservationUseCase } from './usecases/delete-reservation.usecase'
import { UpdateReservationStatusUseCase } from './usecases/update-reservation-status.usecase'
import { PrismaReservationRepositoryAdapter } from '@/modules/reservation/infrastructure/repositories/prisma.reservation.repository.adapter'

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
    CreateReservationUseCase,
    DeleteReservationUseCase,
    FindReservationUseCase,
    FindReservationsUseCase,
    UpdateReservationUseCase,
    UpdateReservationStatusUseCase,
    {
      provide: 'ReservationRepository',
      useClass: PrismaReservationRepositoryAdapter,
    },
  ],
  exports: [
    CreateReservationUseCase,
    FindReservationsUseCase,
    FindReservationUseCase,
    UpdateReservationUseCase,
    DeleteReservationUseCase,
    UpdateReservationStatusUseCase,
  ],
})
export class ReservationApplicationModule {}
