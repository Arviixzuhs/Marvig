export class ApartmentNotAvailableError extends Error {
  constructor(message = 'Uno o más apartamentos ya están reservados en ese rango de fechas') {
    super(message)
    this.name = 'ApartmentNotAvailableError'
  }
}
