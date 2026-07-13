import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ApartmentsGrid } from './ApartmentsGrid'

export const ApartmentsSection = () => {
  return (
    <section className='max-w-6xl mx-auto px-6 py-16'>
      <div className='flex items-end justify-between mb-8'>
        <div>
          <h2 className='text-2xl font-bold'>Destacados esta semana</h2>
          <p className='text-muted-foreground text-sm mt-1'>Los más buscados en la plataforma</p>
        </div>
        <Link
          to={'/apartments'}
          className='text-sm flex items-center gap-1 font-medium hover:underline transition-all'
          style={{ color: '#2B4FFF' }}
        >
          Ver todos <ArrowRight size={14} />
        </Link>
      </div>
      <ApartmentsGrid />
    </section>
  )
}
