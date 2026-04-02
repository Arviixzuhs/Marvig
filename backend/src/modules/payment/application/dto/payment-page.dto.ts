import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { PaymentType } from '@/modules/payment/infrastructure/graphql/types/payment.type'

@ObjectType()
export class PaymentPage extends PageType(PaymentType) {}
