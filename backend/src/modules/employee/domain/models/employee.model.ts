import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class EmployeeModel {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  lastName: string

  @Field()
  phone: string

  @Field()
  email: string

  @Field({ nullable: true })
  address?: string | null

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field({ nullable: true })
  updatedAt?: Date | null
}
