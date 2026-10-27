import type { ElementType } from 'react'
import { BsInstagram } from 'react-icons/bs'
import { Mail, Phone, Clock } from 'lucide-react'
import { companyInfo } from '@/constants'

interface ContactInfo {
  icon: ElementType
  title: string
  value: string
  subtitle: string
  href?: string
}

const contactDetails: ContactInfo[] = [
  {
    icon: Phone,
    title: 'Teléfono / WhatsApp',
    value: companyInfo.contact.phone,
    subtitle: 'Atención rápida e inmediata',
    href: `tel:${companyInfo.contact.phone.replace(/[^\d+]/g, '')}`,
  },
  {
    icon: Mail,
    title: 'Correo electrónico',
    value: companyInfo.contact.mail,
    subtitle: 'Escríbenos para cotizaciones',
    href: `mailto:${companyInfo.contact.mail}`,
  },
  {
    icon: BsInstagram,
    title: 'Instagram',
    value: companyInfo.socials.instagram.user,
    subtitle: 'Síguenos para fotos y novedades',
    href: companyInfo.socials.instagram.url,
  },
  {
    icon: Clock,
    title: 'Horario de atención',
    value: 'Lun - Dom: 8:00 AM - 8:00 PM',
    subtitle: 'Atención personalizada',
  },
]

const cardClass = 'flex w-full items-center gap-4 p-5 rounded-3xl bg-background-2 transition-colors'

export const ContactSection = () => {
  return (
    <section id='contact' className='flex justify-center bg-white text-black scroll-mt-10'>
      <div className='flex w-full max-w-6xl flex-col gap-10 sm:gap-12 px-4 sm:px-6 py-16 sm:py-24'>
        <div className='flex flex-col gap-4'>
          <h2 className='font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-balance'>
            Contacto
          </h2>
          <p className='max-w-xl text-base sm:text-lg leading-relaxed text-black/75'>
            ¿Tienes dudas sobre las instalaciones, reservas o disponibilidad? Escríbenos y te
            responderemos a la brevedad.
          </p>
        </div>

        <ul className='flex flex-wrap gap-4'>
          {contactDetails.map(({ icon: Icon, title, value, subtitle, href }) => {
            const content = (
              <>
                <span className='flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-black'>
                  <Icon className='w-5 h-5 text-tertiary' />
                </span>
                <span className='flex min-w-0 flex-col'>
                  <span className='text-sm text-black/65'>{title}</span>
                  <span className='font-semibold break-words'>{value}</span>
                  <span className='text-sm text-black/65'>{subtitle}</span>
                </span>
              </>
            )

            return (
              <li key={title} className='flex w-full sm:w-[calc(50%-0.5rem)]'>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel='noopener noreferrer'
                    className={`${cardClass} hover:bg-[#EDE9E6]`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={cardClass}>{content}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
