import { Accordion, AccordionItem } from '@heroui/react'

interface FaqItem {
  id: string
  question: string
  answer: string
}

export const FaqSection = () => {
  const faqData: FaqItem[] = [
    {
      id: 'check-in-out',
      question: '¿Cuáles son las horas de Check-in y Check-out?',
      answer:
        'El horario de entrada (Check-in) es a partir de las 3:00 PM y la salida (Check-out) debe realizarse antes de la 1:00 PM. Si necesitas un horario flexible, por favor contáctanos previamente para evaluar la disponibilidad.',
    },
    {
      id: 'cancellation',
      question: '¿Cuál es la política de cancelación de reservas?',
      answer:
        'Ofrecemos cancelación gratuita hasta 48 horas antes de tu fecha de llegada. Las cancelaciones realizadas fuera de este plazo o las no presentaciones (no-show) conllevarán el cargo de la primera noche de hospedaje.',
    },
    {
      id: 'payment-methods',
      question: '¿Qué métodos de pago aceptan para confirmar la reserva?',
      answer:
        'Aceptamos transferencias bancarias nacionales, pagos mediante plataformas digitales (Zelle, PayPal) y las principales tarjetas de crédito/débito directamente en nuestro motor de reservas seguro.',
    },
    {
      id: 'services-included',
      question: '¿Los apartamentos cuentan con servicios de respaldo (agua/luz)?',
      answer:
        'Sí, la posada cuenta con planta eléctrica de emergencia total y sistema de hidroneumático con tanque de reserva propio, garantizando el suministro continuo de agua y electricidad durante toda tu estancia.',
    },
    {
      id: 'pets',
      question: '¿Se permiten mascotas en las instalaciones?',
      answer:
        'Para garantizar la tranquilidad y el confort de todos los huéspedes, lamentablemente no aceptamos mascotas en los apartamentos ni en las áreas comunes de la posada.',
    },
  ]

  return (
    <section className='max-w-6xl mx-auto px-6 py-16'>
      <div className='text-center mb-10'>
        <h2 className='text-3xl font-bold tracking-tight text-default-900 sm:text-4xl'>
          Preguntas Frecuentes
        </h2>
        <p className='mt-4 text-large text-default-500'>
          Resuelve tus dudas al instante sobre el proceso de reserva y nuestros servicios.
        </p>
      </div>
      <Accordion
        variant='splitted'
        selectionMode='multiple'
        className='px-0 gap-3'
        itemClasses={{
          base: 'bg-default-50 dark:bg-default-100 shadow-sm rounded-xl border border-default-200/50',
          title: 'font-semibold text-default-800 text-medium py-4',
          trigger: 'px-6 py-2 data-[hover=true]:bg-default-100/50 rounded-xl transition-colors',
          content: 'px-6 pb-5 pt-0 text-default-600 text-small leading-relaxed',
          indicator: 'text-primary text-medium font-bold',
        }}
      >
        {faqData.map((item) => (
          <AccordionItem key={item.id} aria-label={item.question} title={item.question}>
            {item.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
