import { Stripe } from 'stripe'
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { CreatePaymentUseCase } from '@/modules/payment/application/usecases/create-payment.usecase'
import {
  Req,
  Res,
  Post,
  Headers,
  Controller,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common'

config()

@Controller('stripe')
export class StripeController {
  private stripe: Stripe

  constructor(private readonly createPaymentUseCase: CreatePaymentUseCase) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }

  @Post('create-session')
  async createSession() {
    try {
      const session = await this.stripe.checkout.sessions.create({
        metadata: {
          reservationId: null,
        },
        line_items: [
          {
            price_data: {
              product_data: {
                name: 'Laptop',
              },
              currency: 'usd',
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      })

      console.log(session)
      return session
    } catch (error) {
      console.log(error)
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event

    try {
      event = this.stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
    } catch (err) {
      console.error(`Error de validación de Webhook: ${err.message}`)
      throw new BadRequestException(`Webhook Error: ${err.message}`)
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await this.handleCompletedSession(session)
        break

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Pago fallido: ${paymentIntent.id}`)
        break

      default:
        console.log(`Evento no manejado: ${event.type}`)
    }

    return res.status(200).send({ received: true })
  }

  private async handleCompletedSession(session: Stripe.Checkout.Session) {
    const reservationId = session.metadata?.reservationId
    const amount = session.amount_total / 100

    if (!reservationId) {
      console.error('Sesión completada sin reservationId en metadata')
      return
    }

    await this.createPaymentUseCase.execute({
      amount: amount,
      description: `Pago en línea (Stripe) - Session ID: ${session.id}`,
      reservationId: Number(reservationId),
    })

    console.log(`Pago registrado para la reserva #${reservationId}`)
  }
}
