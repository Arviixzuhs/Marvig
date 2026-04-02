export abstract class BaseMapper<Model, Dto> {
  abstract modelToDto(model: Model): Dto

  modelsToDtos(models: Model[]): Dto[] {
    return models.map((m) => this.modelToDto(m))
  }
}
