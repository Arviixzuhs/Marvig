import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export const WelcomeScreen = ({ userName }: { userName: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
    className='flex flex-col items-center text-center max-w-2xl mx-auto'
  >
    <div className='p-4 bg-orange-500/10 rounded-2xl mb-4 text-orange-500'>
      <Sparkles size={40} className='animate-pulse' />
    </div>

    <h2 className='text-3xl md:text-4xl font-semibold tracking-tight text-default-900 dark:text-white leading-normal'>
      Bienvenido{' '}
      <span className='bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent'>
        {userName}
      </span>
    </h2>

    <p className='text-default-500 mt-2 max-w-sm text-sm'>¿Qué tienes en mente?</p>
  </motion.div>
)
