import { appConfig } from '@/config'

export const Footer = () => {
  return (
    <footer className='border-t border-border bg-card px-6 py-8'>
      <div className='flex items-center justify-center w-full'>
        <span className='text-xs text-muted-foreground'>
          © {new Date().getFullYear()} Posada {appConfig.company} C.A. Todos los derechos
          reservados.
        </span>
      </div>
    </footer>
  )
}
