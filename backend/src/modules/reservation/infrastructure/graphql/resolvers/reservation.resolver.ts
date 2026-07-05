import { User } from '@/interfaces/user.interface'
import { UserRole } from '@/common/enums/user-role.enum'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { ReservationType } from '@/modules/reservation/infrastructure/graphql/types/reservation.type'
import { InvalidDateType } from '@/modules/reservation/infrastructure/graphql/types/invalid-date.type'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationPageType } from '@/modules/reservation/infrastructure/graphql/types/reservation-page.type'
import { ReservationFilterInput } from '@/modules/reservation/infrastructure/graphql/inputs/reservation-filter.input'
import { UpdateReservationInput } from '@/modules/reservation/infrastructure/graphql/inputs/update-reservation.input'
import { CreateReservationInput } from '@/modules/reservation/infrastructure/graphql/inputs/create-reservation.input'
import { FindReservationUseCase } from '@/modules/reservation/application/usecases/find-reservation.usecase'
import { GetInvalidDatesUseCase } from '@/modules/reservation/application/usecases/get-invalid-dates.usercase'
import { FindReservationsUseCase } from '@/modules/reservation/application/usecases/find-reservations.usecase'
import { CreateReservationUseCase } from '@/modules/reservation/application/usecases/create-reservation.usecase'
import { UpdateReservationUseCase } from '@/modules/reservation/application/usecases/update-reservation.usecase'
import { DeleteReservationUseCase } from '@/modules/reservation/application/usecases/delete-reservation.usecase'
import { UpdateReservationStatusUseCase } from '@/modules/reservation/application/usecases/update-reservation-status.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    private readonly getInvalidDatesUseCase: GetInvalidDatesUseCase,
    private readonly findReservationUseCase: FindReservationUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly findReservationsUseCase: FindReservationsUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
  ) {}

  @Query(() => [InvalidDateType], {
    description:
      'Obtiene todas las fechas no disponibles (ocupadas) para un apartamento específico',
  })
  getInvalidDates(
    @Args('apartmentIds', { type: () => [Int] }) apartmentIds: number[],
    @Args('reserveIdToExclude', { type: () => Int, nullable: true }) reserveIdToExclude?: number,
  ): Promise<InvalidDateType[]> {
    return this.getInvalidDatesUseCase.execute(apartmentIds, reserveIdToExclude)
  }

  @Mutation(() => ReservationType, {
    description: 'Crea una nueva reserva validando disponibilidad',
  })
  createReservation(
    @Args('data') data: CreateReservationInput,
    @CurrentUser() user: User,
  ): Promise<ReservationType> {
    return this.createReservationUseCase.execute(data, user.userId)
  }

  @Query(() => ReservationType, { description: 'Obtiene los detalles de una reserva' })
  findReservation(@Args('id', { type: () => Int }) id: number): Promise<ReservationType> {
    return this.findReservationUseCase.execute(id)
  }

  @Query(() => ReservationPageType, { description: 'Obtiene el listado histórico de reservas' })
  findReservations(@Args('filters') filters: ReservationFilterInput, @CurrentUser() user: User): Promise<ReservationPageType> {
    return this.findReservationsUseCase.execute(filters, user.userId)
  }

  @Mutation(() => ReservationType, { description: 'Actualiza los datos generales de una reserva' })
  @RequiredRole(UserRole.ADMIN)
  updateReservation(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateReservationInput,
  ): Promise<ReservationType> {
    return this.updateReservationUseCase.execute(id, data)
  }

  @Mutation(() => ReservationType, {
    description: 'Cambia el estado de la reserva (Confirmar, Cancelar, etc)',
  })
  @RequiredRole(UserRole.ADMIN)
  updateReservationStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: ReservationStatus,
  ): Promise<ReservationType> {
    return this.updateReservationStatusUseCase.execute(id, status)
  }

  @Mutation(() => Boolean, { description: 'Elimina una reserva del sistema' })
  @RequiredRole(UserRole.ADMIN)
  async deleteReservation(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteReservationUseCase.execute(id)
    return true
  }
}
