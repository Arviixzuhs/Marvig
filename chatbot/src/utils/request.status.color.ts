export const requestStatusColor = (statusCode: number) => {
  if (statusCode < 200) return '\x1b[34m' // Azul para respuestas informativas
  if (statusCode < 300) return '\x1b[32m' // Verde para respuestas exitosas
  if (statusCode < 400) return '\x1b[33m' // Amarillo para redirecciones
  if (statusCode < 500) return '\x1b[31m' // Rojo para errores del cliente
  return '\x1b[35m' // Magenta para errores del servidor
}
