import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { CreateVerificationCodeInput } from '@/modules/verificationCode/infrastructure/graphql/inputs/create-verification-code.input'
import { CreateVarificationCodeUseCase } from '@/modules/verificationCode/application/usecases/create-verification-code.usecase'
import { ValidateVerificationCodeInput } from '@/modules/verificationCode/infrastructure/graphql/inputs/validate-verification-code.input'
import { ValidateVarificationCodeUseCase } from '@/modules/verificationCode/application/usecases/validate-verification-code.usecase'

@Resolver()
export class VerificationCodeResolver {
  constructor(
    private readonly createVarificationCodeUseCase: CreateVarificationCodeUseCase,
    private readonly validateVarificationCodeUseCase: ValidateVarificationCodeUseCase,
  ) {}

  @Mutation(() => String)
  async createVerificationCode(@Args('data') data: CreateVerificationCodeInput): Promise<String> {
    this.createVarificationCodeUseCase.execute(data.type, data.email)
    return 'Código de verificación creado exitosamente.'
  }

  @Mutation(() => Boolean)
  async validateVerificationCode(
    @Args('data') data: ValidateVerificationCodeInput,
  ): Promise<boolean> {
    return this.validateVarificationCodeUseCase.execute(data.code, data.type, data.email)
  }
}
