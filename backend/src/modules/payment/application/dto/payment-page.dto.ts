import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { PaymentModel } from '@/modules/payment/domain/models/payment.model'

@ObjectType()
export class PaymentPage extends PageType(PaymentModel) {}
