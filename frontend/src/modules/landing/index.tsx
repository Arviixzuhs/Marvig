import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { appConfig } from '@/config'
import { Link } from 'react-router-dom'

const apartments = [
  {
    id: 1,
    name: 'Apartamento con Vista al Mar',
    location: 'Miami Beach, FL',
    price: '$180 / noche',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    description:
      'Moderno apartamento frente al mar con impresionantes vistas al océano y balcón privado.',
  },
  {
    id: 2,
    name: 'Loft de Lujo en el Centro',
    location: 'Nueva York, NY',
    price: '$220 / noche',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop',
    description:
      'Elegante loft ubicado en el corazón de la ciudad, cerca de restaurantes y atracciones.',
  },
  {
    id: 3,
    name: 'Refugio en la Montaña',
    location: 'Aspen, CO',
    price: '$200 / noche',
    image:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop',
    description: 'Acogedor apartamento rodeado de naturaleza, perfecto para escapadas relajantes.',
  },
  {
    id: 4,
    name: 'Suite con Vista a la Ciudad',
    location: 'Chicago, IL',
    price: '$195 / noche',
    image:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop',
    description: 'Elegante apartamento con vistas panorámicas de la ciudad y comodidades premium.',
  },
]

export const LandingPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <header className='sticky top-0 z-50 bg-white/80 backdrop-blur border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <h1 className='text-xl font-semibold tracking-tight'>
            Posada<span className='text-blue-600'>{appConfig.company}</span>
          </h1>

          <nav className='hidden md:flex items-center gap-8 text-sm'>
            <a href='#apartments' className='hover:text-blue-600 transition'>
              Apartamentos
            </a>
            <a href='#about' className='hover:text-blue-600 transition'>
              Nosotros
            </a>
            <a href='#contact' className='hover:text-blue-600 transition'>
              Contacto
            </a>
          </nav>

          <Link to='/login'>
            <Button color='primary' radius='sm' href='/login'>
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </header>

      <section className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-4xl md:text-5xl font-semibold leading-tight mb-6'>
              Encuentra el
              <span className='text-blue-600'> apartamento perfecto</span>
            </h2>

            <p className='text-gray-600 text-lg mb-8 max-w-lg'>
              Descubre apartamentos modernos y cómodos para tu próximo viaje. Reserva fácilmente y
              disfruta de una experiencia vacacional sin complicaciones.
            </p>

            <div className='flex gap-4'>
              <Button>Explorar apartamentos</Button>
              <Button variant='flat'>Saber más</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className='relative'
          >
            <img
              src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'
              alt='Apartamento vacacional'
              className='rounded-3xl shadow-xl object-cover w-full h-[420px]'
            />
          </motion.div>
        </div>
      </section>

      <section id='apartments' className='py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='mb-12 text-center'>
            <h3 className='text-3xl md:text-4xl font-semibold mb-4'>Apartamentos disponibles</h3>

            <p className='text-gray-600 max-w-2xl mx-auto'>
              Elige entre una selección de apartamentos vacacionales diseñados para ofrecer
              comodidad, estilo y conveniencia.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {apartments.map((apartment, index) => (
              <motion.div
                key={apartment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className='bg-white rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden group'
              >
                <div className='overflow-hidden'>
                  <img
                    src={apartment.image}
                    alt={apartment.name}
                    className='w-full h-56 object-cover group-hover:scale-105 transition duration-300'
                  />
                </div>

                <div className='p-6 flex flex-col gap-3'>
                  <div className='flex items-start justify-between'>
                    <h4 className='text-lg font-semibold'>{apartment.name}</h4>

                    <span className='text-blue-600 font-medium'>{apartment.price}</span>
                  </div>

                  <p className='text-sm text-gray-500'>{apartment.location}</p>

                  <p className='text-gray-600 text-sm leading-relaxed'>{apartment.description}</p>

                  <div className='pt-3 mt-auto'>
                    <Button className='w-full' color='primary'>
                      Reservar ahora
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className='border-t bg-white mt-20'>
        <div className='max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-gray-500'>
            © {new Date().getFullYear()} {appConfig.company}. Todos los derechos reservados.
          </p>

          <div className='flex gap-6 text-sm text-gray-500'>
            <a href='#' className='hover:text-blue-600 transition'>
              Privacidad
            </a>
            <a href='#' className='hover:text-blue-600 transition'>
              Términos
            </a>
            <a href='#' className='hover:text-blue-600 transition'>
              Soporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
