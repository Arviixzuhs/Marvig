import { Stripe } from 'stripe'
import { config } from 'dotenv'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { Request, Response } from 'express'
import { CreatePaymentUseCase } from '@/modules/payment/application/usecases/create-payment.usecase'
import { CreateReservationUseCase } from '@/modules/reservation/application/usecases/create-reservation.usecase'
import { UpdateReservationStatusUseCase } from '@/modules/reservation/application/usecases/update-reservation-status.usecase'
import {
  Req,
  Res,
  Post,
  Body,
  Headers,
  Controller,
  RawBodyRequest,
  BadRequestException,
} from '@nestjs/common'

config()

@Controller('stripe')
@ApiBearerAuth()
export class StripeController {
  private stripe: Stripe

  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }

  @Post('create-session')
  async createSession(@Body() reservationDto: ReservationDto, @Req() req: Request) {
    try {
      const reservation = await this.createReservationUseCase.execute(
        reservationDto,
        req.user.userId,
      )

      const session = await this.stripe.checkout.sessions.create({
        metadata: {
          reservationId: reservation.id.toString(),
        },
        line_items: [
          {
            price_data: {
              product_data: {
                name: `Reserva en Posada Marvig - Aptos: ${reservationDto.apartmentIds.join(', ')}`,
                description: `Estadía desde ${reservationDto.startDate} hasta ${reservationDto.endDate}`,
              },
              currency: 'usd',
              unit_amount: Number(reservation.totalPrice) * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success?reservationId=${reservation.id}`,
        cancel_url: `http://localhost:3000/cancel`,
      })

      return { url: session.url }
    } catch (error) {
      console.error('Error al crear sesión:', error)
      throw new BadRequestException(error.message)
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
        this.updateReservationStatusUseCase.execute(
          Number(session.metadata?.reservationId),
          ReservationStatus.FAILED,
        )
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

    this.updateReservationStatusUseCase.execute(Number(reservationId), ReservationStatus.CONFIRMED)
  }
}
