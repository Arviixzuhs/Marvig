import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pluralize } from '@/utils/pluralize'
import { ApartmentModel } from '@/models/ApartmentModel'
import { formatCurrency } from '@/utils/formatCurrency'
import { Bath, Bed, Square } from 'lucide-react'

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
        viewport={{ once: true }}
        className='bg-white rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden group'
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className='bg-card rounded-lg border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow group'>
          <div className='relative h-44 bg-muted overflow-hidden'>
            {apartment.images && apartment.images.length > 0 && (
              <img
                src={apartment.images[0].url}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
            )}
          </div>
          <div className='p-4'>
            <h3 className='font-semibold text-sm mb-0.5'>Apartamento #{apartment.number}</h3>

            <div className='flex items-center gap-3 text-xs text-muted-foreground mb-3'>
              <span className='flex items-center gap-1'>
                <Bed size={11} /> {apartment.bedrooms} hab.
              </span>
              <span className='flex items-center gap-1'>
                <Bath size={11} /> {apartment.bathrooms}{' '}
                {pluralize(apartment.bathrooms, 'baño', 'baños')}
              </span>
              <span className='flex items-center gap-1'>
                <Square size={11} /> {apartment.squareMeters}m²
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-sm'>
                {formatCurrency(apartment.pricePerDay)}
                <span className='text-muted-foreground font-normal text-xs'>/noche</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
