export abstract class BaseMapper<Model, Dto> {
  abstract modelToDomain(model: Model): Dto

  modelsToDomain(models: Model[]): Dto[] {
    return models.map((m) => this.modelToDomain(m))
  }
}
