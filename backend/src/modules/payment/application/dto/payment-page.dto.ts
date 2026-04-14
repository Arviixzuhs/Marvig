import { PageType } from '@/common/dto/page-response.dto'
import { PaymentModel } from '@/modules/payment/domain/models/payment.model'

export class PaymentPage extends PageType(PaymentModel) {}
