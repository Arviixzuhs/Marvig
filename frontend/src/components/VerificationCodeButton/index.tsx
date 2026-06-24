import { useState } from 'react'
import { verificationCodeService } from '@/services/verificationCode'
import { VerificationCodeType } from '@/models/VerificationCodeModel'
import { Button, Divider, Input, Card, CardBody } from '@heroui/react'

export const VerificationCodeTestBed = () => {
  // Estados para el flujo de Creación
  const [email, setEmail] = useState('')
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [createLoading, setCreateLoading] = useState(false)

  // Estados para el flujo de Validación
  const [codeToValidate, setCodeToValidate] = useState('')
  const [isValidated, setIsValidated] = useState<boolean | null>(null)
  const [validateLoading, setValidateLoading] = useState(false)

  // Estado global para capturar errores del Backend (como el ConflictException)
  const [error, setError] = useState<string | null>(null)

  // 1. Manejador para crear el código
  const handleCreateCode = async () => {
    if (!email) return alert('Por favor, ingresa un correo')

    setCreateLoading(true)
    setError(null)
    setCreatedCode(null)

    try {
      const rawCode = await verificationCodeService.create({
        email,
        type: VerificationCodeType.PASSWORD_RESET, // O VERIFY_EMAIL según tu prueba
      })
      setCreatedCode(rawCode)
    } catch (err: any) {
      console.log(err)
      // Captura el mensaje formateado que viene de tu backend ("Debes esperar Xh...")
      setError(err?.message || 'Error al crear el código')
    } finally {
      setCreateLoading(false)
    }
  }

  // 2. Manejador para validar el código
  const handleValidateCode = async () => {
    if (!codeToValidate) return alert('Por favor, ingresa el código a validar')

    setValidateLoading(true)
    setError(null)
    setIsValidated(null)

    try {
      const success = await verificationCodeService.validate({
        email,
        code: codeToValidate,
        type: VerificationCodeType.PASSWORD_RESET,
      })
      setIsValidated(success)
    } catch (err: any) {
      setError(err?.message || 'Error al validar el código')
    } finally {
      setValidateLoading(false)
    }
  }

  return (
    <div className='max-w-md p-6 mx-auto space-y-6'>
      <Card>
        <CardBody className='space-y-4'>
          <h3 className='text-lg font-bold'>Paso 1: Solicitar Código</h3>
          <Input
            type='email'
            label='Correo Electrónico'
            placeholder='ejemplo@correo.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button color='primary' isLoading={createLoading} onClick={handleCreateCode} fullWidth>
            Enviar código de verificación
          </Button>

          {createdCode && (
            <div className='p-3 text-sm rounded-lg bg-success-50 text-success-700'>
              <strong>Código generado (Simulación Mailer):</strong> {createdCode}
            </div>
          )}
        </CardBody>
      </Card>

      <Divider className='my-4' />

      <Card>
        <CardBody className='space-y-4'>
          <h3 className='text-lg font-bold'>Paso 2: Validar Código</h3>
          <Input
            type='text'
            label='Código Recibido'
            placeholder='Ingresa el código hexadecimal'
            value={codeToValidate}
            onChange={(e) => setCodeToValidate(e.target.value)}
          />
          <Button
            color='secondary'
            isLoading={validateLoading}
            onPress={handleValidateCode}
            fullWidth
          >
            Validar código
          </Button>

          {isValidated !== null && (
            <div
              className={`p-3 text-sm rounded-lg ${isValidated ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}
            >
              <strong>Resultado:</strong>{' '}
              {isValidated ? '¡Código válido y quemado con éxito!' : 'Código inválido.'}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Alerta de errores de backend */}
      {error && (
        <div className='p-3 text-sm rounded-lg bg-danger-50 text-danger-600 font-medium border border-danger-200'>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
