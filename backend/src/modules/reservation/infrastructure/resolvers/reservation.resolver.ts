import { User } from '@/interfaces/user.interface'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { FindReservationUseCase } from '@/modules/reservation/application/usecases/find-reservation.usecase'
import { CreateReservationUseCase } from '@/modules/reservation/application/usecases/create-reservation.usecase'
import { FindReservationsUseCase } from '@/modules/reservation/application/usecases/find-reservations.usecase'
import { UpdateReservationUseCase } from '@/modules/reservation/application/usecases/update-reservation.usecase'
import { DeleteReservationUseCase } from '@/modules/reservation/application/usecases/delete-reservation.usecase'
import { UpdateReservationStatusUseCase } from '@/modules/reservation/application/usecases/update-reservation-status.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ReservationModel)
export class ReservationResolver {
  constructor(
    private readonly findReservationUseCase: FindReservationUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly findReservationsUseCase: FindReservationsUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
  ) {}

  @Mutation(() => ReservationModel, {
    description: 'Crea una nueva reserva validando disponibilidad',
  })
  createReservation(
    @Args('data') data: ReservationDto,
    @CurrentUser() user: User,
  ): Promise<ReservationModel> {
    return this.createReservationUseCase.execute(data, user.userId)
  }

  @Query(() => ReservationModel, { description: 'Obtiene los detalles de una reserva' })
  findReservation(@Args('id', { type: () => Int }) id: number): Promise<ReservationModel> {
    return this.findReservationUseCase.execute(id)
  }

  @Query(() => [ReservationModel], { description: 'Obtiene el listado histórico de reservas' })
  findReservations(): Promise<ReservationModel[]> {
    return this.findReservationsUseCase.execute()
  }

  @Mutation(() => ReservationModel, { description: 'Actualiza los datos generales de una reserva' })
  updateReservation(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: ReservationDto,
  ): Promise<ReservationModel> {
    return this.updateReservationUseCase.execute(id, data)
  }

  @Mutation(() => ReservationModel, {
    description: 'Cambia el estado de la reserva (Confirmar, Cancelar, etc)',
  })
  updateReservationStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: string,
  ): Promise<ReservationModel> {
    return this.updateReservationStatusUseCase.execute(id, status)
  }

  @Mutation(() => Boolean, { description: 'Elimina una reserva del sistema' })
  async deleteReservation(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteReservationUseCase.execute(id)
    return true
  }
}
