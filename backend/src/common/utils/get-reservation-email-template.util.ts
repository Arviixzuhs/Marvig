import { getFormattedDateTime } from './getFormattedDateTime'

interface IReservationEmailContentProps {
  startDate: string | Date
  endDate: string | Date
  total: number | string
  paymentReference: string
  reservationUrl: string
}

export const getReservationEmailContent = ({
  startDate,
  endDate,
  total,
  paymentReference,
  reservationUrl,
}: IReservationEmailContentProps): string => `
  <p>
    Gracias por elegir <strong>Posada Marvig</strong>. Registramos tu solicitud de
    reserva, pero <strong>aún no está confirmada</strong>.
  </p>

  <div class="reservation-details">
    <p><strong>Estado:</strong> Pendiente de confirmación</p>
    <p><strong>Fecha de entrada:</strong> ${getFormattedDateTime({ value: startDate })}</p>
    <p><strong>Fecha de salida:</strong> ${getFormattedDateTime({ value: endDate })}</p>
    <p><strong>Total de la reserva:</strong> $${total}</p>
    <p style="margin-top: 8px; font-size: 13px; color: #71717a;">
      Referencia: <strong>${paymentReference}</strong>
    </p>
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" bgcolor="#000000" style="border-radius: 8px;">
              <a
                href="${reservationUrl}"
                target="_blank"
                style="display: inline-block; padding: 12px 24px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;"
              >
                Ver mi reserva
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`
