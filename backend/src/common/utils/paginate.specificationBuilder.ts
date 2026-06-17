export class PaginateSpecificationBuilder {
  protected skip?: number
  protected take?: number

  withPagination(page: number = 0, pageSize: number = 10, isUnpaged: boolean = false) {
    if (isUnpaged) {
      this.skip = undefined
      this.take = undefined
    } else {
      this.skip = page * pageSize
      this.take = pageSize
    }
    return this
  }
}
