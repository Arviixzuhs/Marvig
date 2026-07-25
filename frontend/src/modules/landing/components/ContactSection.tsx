import React, { useState } from 'react'
import { Card, CardBody, Input, Textarea, Button, Divider } from '@heroui/react'
import { BsInstagram } from 'react-icons/bs'
import { Mail, Phone, Clock, Send, MessageSquare } from 'lucide-react'

interface ContactInfo {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  href?: string
}

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const contactDetails: ContactInfo[] = [
    {
      icon: <Phone className='w-5 h-5 text-primary' />,
      title: 'Teléfono / WhatsApp',
      value: '+58 (412) 000-0000',
      subtitle: 'Atención rápida e inmediata',
    },
    {
      icon: <Mail className='w-5 h-5 text-red-500' />,
      title: 'Correo Electrónico',
      value: 'contacto@posadamarvig.com',
      subtitle: 'Escríbenos para cotizaciones',
    },
    {
      icon: <BsInstagram className='w-5 h-5 text-danger' />,
      title: 'Instagram',
      value: '@posadamarvig',
      subtitle: 'Síguenos para fotos y novedades',
      href: 'https://instagram.com/posadamarvig',
    },
    {
      icon: <Clock className='w-5 h-5 text-warning' />,
      title: 'Horario de Atención',
      value: 'Lun - Dom: 8:00 AM - 8:00 PM',
      subtitle: 'Atención personalizada',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Datos enviados:', formData)
  }

  return (
    <section className='max-w-6xl mx-auto px-6 py-16'>
      {/* Encabezado */}
      <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
        <div className='max-w-xl'>
          <p className='text-small font-semibold tracking-wider text-primary uppercase mb-2'>
            Estamos para ayudarte
          </p>
          <h2 className='text-3xl font-bold tracking-tight text-default-900 sm:text-4xl'>
            Ponte en contacto con nosotros
          </h2>
        </div>
        <p className='text-default-500 max-w-md text-medium'>
          ¿Tienes dudas sobre las instalaciones, reservas o disponibilidad? Escríbenos y te
          responderemos a la brevedad.
        </p>
      </div>

      <Divider className='my-6 bg-default-200/60' />

      {/* Grid Principal: Formulario + Información */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8'>
        {/* Formulario de Contacto */}
        <Card className='lg:col-span-7 border-none bg-default-50 dark:bg-default-100 shadow-sm p-2 sm:p-4'>
          <CardBody className='gap-6'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                <MessageSquare className='w-5 h-5' />
              </div>
              <h3 className='text-xl font-bold text-default-800'>Envíanos un mensaje</h3>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Input
                  isRequired
                  type='text'
                  label='Nombre completo'
                  placeholder='Ej. Juan Pérez'
                  variant='flat'
                  value={formData.name}
                  onValueChange={(val) => setFormData({ ...formData, name: val })}
                />
                <Input
                  isRequired
                  type='email'
                  label='Correo electrónico'
                  placeholder='juan@ejemplo.com'
                  variant='flat'
                  value={formData.email}
                  onValueChange={(val) => setFormData({ ...formData, email: val })}
                />
              </div>

              <Input
                type='tel'
                label='Teléfono / WhatsApp'
                placeholder='+58 412 0000000'
                variant='flat'
                value={formData.phone}
                onValueChange={(val) => setFormData({ ...formData, phone: val })}
              />

              <Textarea
                isRequired
                label='Mensaje'
                placeholder='Cuéntanos la fecha de tu estadía o tus dudas particulares...'
                minRows={4}
                variant='flat'
                value={formData.message}
                onValueChange={(val) => setFormData({ ...formData, message: val })}
              />

              <Button
                type='submit'
                color='primary'
                size='lg'
                className='font-semibold mt-2'
                endContent={<Send className='w-4 h-4' />}
              >
                Enviar mensaje
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Tarjetas de Información de Contacto */}
        <div className='lg:col-span-5 flex flex-col gap-4'>
          {contactDetails.map((item, index) => {
            const CardContent = (
              <CardBody className='p-5 flex flex-row items-center gap-4'>
                <div className='p-3 bg-default-200/50 dark:bg-default-200/30 rounded-xl flex items-center justify-center shrink-0'>
                  {item.icon}
                </div>
                <div className='space-y-0.5 overflow-hidden'>
                  <p className='text-tiny text-default-400 uppercase font-semibold tracking-wider'>
                    {item.title}
                  </p>
                  <p className='text-medium font-bold text-default-800 truncate'>{item.value}</p>
                  <p className='text-small text-default-500'>{item.subtitle}</p>
                </div>
              </CardBody>
            )

            return (
              <Card
                key={index}
                isPressable={!!item.href}
                as={item.href ? 'a' : 'div'}
     

                rel={item.href ? 'noopener noreferrer' : undefined}
                className='border-none bg-default-50 dark:bg-default-100 shadow-sm transition-all duration-300 hover:-translate-y-1'
              >
                {CardContent}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}