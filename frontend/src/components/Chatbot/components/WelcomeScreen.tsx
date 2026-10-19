import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  userName: string
  maxChars?: number
}

export const WelcomeScreen = ({ userName, maxChars = 18 }: WelcomeScreenProps) => {
  const formattedName = userName.length > maxChars ? `${userName.slice(0, maxChars)}...` : userName

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col items-center text-center max-w-2xl mx-auto px-4 w-full overflow-hidden'
    >
      <div className='p-3 sm:p-4 bg-orange-500/10 rounded-2xl mb-4 text-orange-500 flex items-center justify-center'>
        <Sparkles className='w-8 h-8 sm:w-10 sm:h-10 animate-pulse' />
      </div>

      <h2 className='w-full max-w-full text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-default-900 dark:text-white leading-tight'>
        Bienvenido{' '}
        <span
          title={userName}
          className='inline-block max-w-full truncate bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent font-semibold align-bottom'
        >
          {formattedName}
        </span>
      </h2>

      <p className='text-default-500 mt-2 max-w-sm text-xs sm:text-sm'>¿Qué tienes en mente?</p>
    </motion.div>
  )
}
