import { Field, InputType } from '@nestjs/graphql'
import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'

@InputType()
export class CreateVerificationCodeInput {
  @Field(() => VerificationCodeType)
  type: VerificationCodeType

  @Field()
  email: string
}
