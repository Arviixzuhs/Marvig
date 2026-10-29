import { User } from '@/interfaces/user.interface'
import { UserRole } from '@/common/enums/user-role.enum'
import { ReservationPageDto } from '@/modules/reservation/application/dto/reservation-page.dto'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import {
  Inject,
  Injectable,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class FindReservationsUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(filters: ReservationFilterDto, user: User): Promise<ReservationPageDto> {
    if (!user) throw new UnauthorizedException('No estás autorizado para realizar esta acción.')

    const { mine, ...rest } = filters

    if (mine && filters.userId !== undefined) {
      throw new BadRequestException(
        'No puedes utilizar dos filtros relacionados con el usuario al mismo tiempo.',
      )
    }

    const isAdmin = user.role === UserRole.ADMIN

    if (!isAdmin && filters.userId !== undefined && filters.userId !== user.userId) {
      throw new ForbiddenException(`Acceso denegado. Se requiere el rol ${UserRole.ADMIN}.`)
    }

    const canQueryOthers = isAdmin && !mine
    const userId = canQueryOthers ? filters.userId : user.userId

    return this.reservationRepository.findReservations({ ...rest, userId })
  }
}
