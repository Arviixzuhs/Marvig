import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  lastName: string

  @Field({ nullable: true })
  email?: string | null

  @Field({ nullable: true })
  avatar?: string | null

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field({ nullable: true })
  updatedAt?: Date | null
}
