export class ConcurrentReservationError extends Error {
  constructor(message = 'Otra reserva se estaba procesando al mismo tiempo') {
    super(message)
    this.name = 'ConcurrentReservationError'
  }
}
