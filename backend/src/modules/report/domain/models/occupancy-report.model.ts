export class ApartmentOccupancyModel {
  apartmentId: number
  apartmentNumber: string
  floor: number
  totalNights: number
  occupiedNights: number
  blockedNights: number
  availableNights: number
  occupancyPercentage: number
  generatedIncome: number
}

export class OccupancyReportModel {
  fromDate: Date
  toDate: Date
  apartments: ApartmentOccupancyModel[]
}
