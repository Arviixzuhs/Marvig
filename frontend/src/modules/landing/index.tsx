import { useState } from 'react'
import { api } from '@/api/axios-client'

export const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const generarLinkDePago = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.post('/stripe/create-session', {
        endDate: '2026-04-10T14:00:00.000Z',
        startDate: '2026-04-05T12:00:00.000Z',
        apartmentIds: [1],
        totalPrice: 360,
        type: 'DAILY',
      })

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error al generar el link de pago:', error)
      alert('Hubo un error al procesar la reserva')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Reserva en Posada Marvig</h1>
      <button
        onClick={generarLinkDePago}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: isLoading ? '#ccc' : '#6772e5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Procesando...' : 'Pagar Reserva con Stripe'}
      </button>
    </div>
  )
}
