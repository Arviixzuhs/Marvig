export const validatePassword = (password: string) => {
  // Verificar longitud de la contraseña
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  if (password.length > 20) {
    return 'La contraseña no puede tener más de 20 caracteres.'
  }

  // Verificar patrón de caracteres
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_])[A-Za-z\d\W\_]{8,}$/
  if (!regex.test(password)) {
    return 'La contraseña debe incluir una mayúscula, un número y un carácter especial.'
  }

  return ''
}
