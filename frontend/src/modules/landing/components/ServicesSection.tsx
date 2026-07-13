import React from 'react'
import { Card, CardBody, Divider } from '@heroui/react'
import { Wifi, ShieldCheck, Zap, Waves, MapPin, Utensils } from 'lucide-react'

interface ServiceItem {
  icon: React.ReactNode
  title: string
  description: string
}

export const ServicesSection = () => {
  const services: ServiceItem[] = [
    {
      icon: <Zap className='w-6 h-6 text-warning' />,
      title: 'Energía y Agua Garantizada',
      description:
        'Contamos con planta eléctrica total de emergencia y sistemas de agua hidroneumáticos para que tu estadía no sufra interrupciones.',
    },
    {
      icon: <Wifi className='w-6 h-6 text-primary' />,
      title: 'Wi-Fi de Alta Velocidad',
      description:
        'Conexión estable y veloz en todos los apartamentos y áreas comunes, ideal tanto para el descanso como para el trabajo remoto.',
    },
    {
      icon: <Waves className='w-6 h-6 text-info text-blue-500' />,
      title: 'Piscina y Áreas Comunes',
      description:
        'Disfruta de nuestra piscina climatizada, solárium y zonas de descanso al aire libre diseñadas para toda la familia.',
    },
    {
      icon: <ShieldCheck className='w-6 h-6 text-success' />,
      title: 'Seguridad 24/7',
      description:
        'Circuito cerrado de cámaras, control de acceso estricto y estacionamiento privado techado para la total tranquilidad de tu vehículo.',
    },
    {
      icon: <Utensils className='w-6 h-6 text-danger' />,
      title: 'Zona de Parrilleras',
      description:
        'Espacios totalmente equipados para preparar tus asados y compartir momentos especiales al aire libre con tus acompañantes.',
    },
    {
      icon: <MapPin className='w-6 h-6 text-red-500' />,
      title: 'Ubicación Estratégica',
      description:
        'Situados en una zona residencial tranquila, a escasos minutos de las principales playas, restaurantes y centros comerciales.',
    },
  ]

  return (
    <section className='max-w-6xl mx-auto px-6 py-16'>
      {/* Encabezado */}
      <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
        <div className='max-w-xl'>
          <p className='text-small font-semibold tracking-wider text-primary uppercase mb-2'>
            Tu comodidad es prioridad
          </p>
          <h2 className='text-3xl font-bold tracking-tight text-default-900 sm:text-4xl'>
            Servicios diseñados para una estadía perfecta
          </h2>
        </div>
        <p className='text-default-500 max-w-md text-medium'>
          Nos encargamos de cada detalle para que solo te preocupes por relajarte y disfrutar de las
          instalaciones del complejo.
        </p>
      </div>

      <Divider className='my-6 bg-default-200/60' />

      {/* Grid de Servicios/Beneficios */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
        {services.map((service, index) => (
          <Card
            key={index}
            isHoverable
            className='border-none bg-default-50 dark:bg-default-100 shadow-sm transition-all duration-300 hover:-translate-y-1'
          >
            <CardBody className='p-6 flex flex-col items-start gap-4'>
              {/* Contenedor del Icono */}
              <div className='p-3 bg-default-200/50 dark:bg-default-200/30 rounded-xl flex items-center justify-center'>
                {service.icon}
              </div>

              {/* Texto */}
              <div className='space-y-2'>
                <h3 className='text-lg font-bold text-default-800'>{service.title}</h3>
                <p className='text-small text-default-500 leading-relaxed'>{service.description}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}
