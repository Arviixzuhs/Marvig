import { appConfig } from '@/config'

export const Footer = () => {
  return (
    <footer className='h-16 border-t border-border bg-card px-6 flex items-center justify-center w-full shrink-0'>
      <span className='text-xs text-muted-foreground text-center'>
        © {new Date().getFullYear()} Posada {appConfig.company} C.A. Todos los derechos reservados.
      </span>
    </footer>
  )
}
