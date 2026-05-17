import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ApartmentModel } from '@/models/ApartmentModel'
import { formatCurrency } from '@/utils/formatCurrency'
import { Bath, Bed, Heart, MapPin, Square, Star } from 'lucide-react'

interface IApartmentCard {
  apartment: ApartmentModel
  index: number
}

export const ApartmentCard = ({ apartment, index }: IApartmentCard) => {
  return (
    <Link to={`/apartment/${apartment.id}`}>
      <motion.div
        key={apartment.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        viewport={{ once: true }}
        className='bg-white rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden group'
      >
        <div className='bg-card rounded-lg border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow group'>
          <div className='relative h-44 bg-muted overflow-hidden'>
            {apartment.images && apartment.images.length > 0 && (
              <img
                src={apartment.images[0].url}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
            )}
            <button className='absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white'>
              <Heart size={13} className='text-muted-foreground' />
            </button>
            <div className='absolute bottom-3 left-3 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1 text-xs font-medium'>
              <Star size={11} className='fill-yellow-400 text-yellow-400' />5
            </div>
          </div>
          <div className='p-4'>
            <h3 className='font-semibold text-sm mb-0.5'>Suit #{apartment.number}</h3>
            <div className='flex items-center gap-1 text-muted-foreground text-xs mb-3'>
              <MapPin size={11} />
              Porlamar, calle 5
            </div>
            <div className='flex items-center gap-3 text-xs text-muted-foreground mb-3'>
              <span className='flex items-center gap-1'>
                <Bed size={11} /> {apartment.bedrooms} hab.
              </span>
              <span className='flex items-center gap-1'>
                <Bath size={11} /> {apartment.bathrooms} baños
              </span>
              <span className='flex items-center gap-1'>
                <Square size={11} /> {apartment.squareMeters}m²
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-sm'>
                {formatCurrency(apartment.pricePerDay)}
                <span className='text-muted-foreground font-normal text-xs'>/día</span>
              </span>
              <span className='text-xs text-muted-foreground'>5 reseñas</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
