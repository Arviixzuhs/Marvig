import { User } from '@/interfaces/user.interface'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationType } from '@/modules/reservation/infrastructure/graphql/types/reservation.type'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationPageType } from '@/modules/reservation/infrastructure/graphql/types/reservation-page.type'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { FindReservationUseCase } from '@/modules/reservation/application/usecases/find-reservation.usecase'
import { FindReservationsUseCase } from '@/modules/reservation/application/usecases/find-reservations.usecase'
import { CreateReservationUseCase } from '@/modules/reservation/application/usecases/create-reservation.usecase'
import { UpdateReservationUseCase } from '@/modules/reservation/application/usecases/update-reservation.usecase'
import { DeleteReservationUseCase } from '@/modules/reservation/application/usecases/delete-reservation.usecase'
import { UpdateReservationStatusUseCase } from '@/modules/reservation/application/usecases/update-reservation-status.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    private readonly findReservationUseCase: FindReservationUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly findReservationsUseCase: FindReservationsUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
  ) {}

  @Mutation(() => ReservationType, {
    description: 'Crea una nueva reserva validando disponibilidad',
  })
  createReservation(
    @Args('data') data: ReservationDto,
    @CurrentUser() user: User,
  ): Promise<ReservationType> {
    return this.createReservationUseCase.execute(data, user.userId)
  }

  @Query(() => ReservationType, { description: 'Obtiene los detalles de una reserva' })
  findReservation(@Args('id', { type: () => Int }) id: number): Promise<ReservationType> {
    return this.findReservationUseCase.execute(id)
  }

  @Query(() => ReservationPageType, { description: 'Obtiene el listado histórico de reservas' })
  findReservations(@Args('filters') filters: ReservationFilterDto): Promise<ReservationPageType> {
    return this.findReservationsUseCase.execute(filters)
  }

  @Mutation(() => ReservationType, { description: 'Actualiza los datos generales de una reserva' })
  updateReservation(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: ReservationDto,
  ): Promise<ReservationType> {
    return this.updateReservationUseCase.execute(id, data)
  }

  @Mutation(() => ReservationType, {
    description: 'Cambia el estado de la reserva (Confirmar, Cancelar, etc)',
  })
  updateReservationStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: ReservationStatus,
  ): Promise<ReservationType> {
    return this.updateReservationStatusUseCase.execute(id, status)
  }

  @Mutation(() => Boolean, { description: 'Elimina una reserva del sistema' })
  async deleteReservation(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteReservationUseCase.execute(id)
    return true
  }
}
