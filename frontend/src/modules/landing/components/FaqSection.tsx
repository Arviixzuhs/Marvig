import { Accordion, AccordionItem, Button } from '@heroui/react'
import { useLenis } from 'lenis/react'
import { MessageCircle, Plus } from 'lucide-react'

interface FaqItem {
  id: string
  question: string
  answer: string
}

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
      'No pierdes tu dinero. Si no puedes viajar en las fechas reservadas, congelamos tu pago como saldo a favor para que disfrutes tu estadía en otras fechas que te vengan mejor. Solo avísanos con anticipación y reprogramamos tu reserva contigo, sujeto a disponibilidad.',
  },
  {
    id: 'payment-methods',
    question: '¿Qué métodos de pago aceptan para confirmar la reserva?',
    answer:
      'Aceptamos transferencias bancarias nacionales, pagos mediante cripto monedas con Binance y las principales tarjetas de crédito/débito.',
  },
  {
    id: 'services-included',
    question: '¿Los apartamentos cuentan con respaldo de agua y luz?',
    answer:
      'La posada cuenta con un sistema hidroneumático con tanque de reserva propio, para que el suministro no se interrumpa durante tu estadía. En cuanto a la electricidad, no contamos con planta eléctrica, por lo que depende del servicio de la red.'
  },
  {
    id: 'pets',
    question: '¿Se permiten mascotas en las instalaciones?',
    answer:
      'Para garantizar la tranquilidad y el confort de todos los huéspedes, lamentablemente no aceptamos mascotas en los apartamentos ni en las áreas comunes de la posada.',
  },
]

export const FaqSection = () => {
  const lenis = useLenis()

  const goToContact = () => {
    const element = document.getElementById('contact')
    if (element) lenis?.scrollTo(element)
  }

  return (
    <section id='faq' className='bg-white text-black scroll-mt-10'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16'>
          {/* Encabezado */}
          <div className='lg:col-span-5'>
            <div className='lg:sticky lg:top-28 flex flex-col gap-3'>
              <h2
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                className='text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-balance'
              >
                Preguntas frecuentes
              </h2>
              <p className='text-base sm:text-lg leading-relaxed text-black/75'>
                Resuelve tus dudas al instante sobre el proceso de reserva y nuestros servicios.
              </p>
              <p className='text-black/75'>¿No encuentras tu respuesta?</p>
              <div>
                <Button
                  onPress={goToContact}
                  size='lg'
                  radius='full'
                  color='primary'
                  startContent={<MessageCircle className='w-4 h-4' />}
                >
                  Escríbenos
                </Button>
              </div>
            </div>
          </div>

          {/* Preguntas */}
          <div className='lg:col-span-7'>
            <Accordion variant='light' selectionMode='multiple'>
              {faqData.map((item) => (
                <AccordionItem
                  key={item.id}
                  aria-label={item.question}
                  title={item.question}
                  indicator={({ isOpen }) => (
                    <Plus
                      aria-hidden
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  )}
                >
                  {item.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
