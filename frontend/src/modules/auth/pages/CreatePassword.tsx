import { AuthBody } from '@/modules/auth/components/AuthBody'
import { AuthFooter } from '@/modules/auth/components/AuthFooter'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { AuthForm } from '@/modules/auth/components/AuthInputForm'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { ContinueWithGoogle } from '@/modules/auth/components/ContinueWithGoogle'
import { Or } from '@/modules/auth/components/Or'
import { authService } from '@/modules/auth/services'
import { validatePassword } from '@/utils/validatePassword'
import { Loader } from 'lucide-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const CreatePassword = () => {
  const navigate = useNavigate()
  const params = useParams<{ confirmationToken: string }>()

  console.log(params)
  const [data, setData] = React.useState({
    password: '',
    repeatPassword: '',
  })

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({
    password: '',
    repeatPassword: '',
  })

  const [isLoading, setIsLoading] = React.useState(false)

  const validateSigningToken = async () => {
    if (!params.confirmationToken) {
      navigate('/')
      return
    }

    try {
      const response = await authService.validateSigningToken(params.confirmationToken)
      if (!response.data) {
        navigate('/login')
      }
    } catch (error) {
      navigate('/login')
    }
  }

  React.useEffect(() => {
    validateSigningToken()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })

    handleValidation(name, value)
  }

  const handleValidation = (name: string, value: string) => {
    let newErrors = { ...errors }

    switch (name) {
      case 'password':
        const passwordError = validatePassword(value)
        if (passwordError) {
          newErrors['password'] = passwordError
        } else {
          newErrors['password'] = ''
        }
        break
      case 'repeatPassword':
        if (value !== data.password) {
          newErrors['repeatPassword'] =
            'Las contraseñas no coinciden. Por favor, verifica y vuelve a intentarlo.'
        } else {
          newErrors['repeatPassword'] = ''
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    let valid = true
    const newErrors = {
      password: '',
      repeatPassword: '',
    }

    const passwordError = validatePassword(data.password)
    if (passwordError) {
      newErrors.password = passwordError
      valid = false
    }

    if (data.password !== data.repeatPassword) {
      newErrors.repeatPassword =
        'Las contraseñas no coinciden. Por favor, verifica y vuelve a intentarlo.'
      valid = false
    }

    setErrors(newErrors)

    if (!valid || !params.confirmationToken) return

    setIsLoading(true)

    try {
      await authService.confirmSigning({
        token: params.confirmationToken,
        password: data.password,
        repeatPassword: data.repeatPassword,
      })
      navigate('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const registerInputs = [
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password',
      value: data.password,
      placeholder: 'Ingresa tu contraseña',
    },
    {
      label: 'Repetir contraseña',
      name: 'repeatPassword',
      type: 'password',
      value: data.repeatPassword,
      placeholder: 'Repite la contraseña',
    },
  ]

  return (
    <>
      {isLoading && <Loader />}
      <AuthBody onSubmit={handleRegister}>
        <AuthHeader title='Crea una contraseña' />
        <AuthForm inputs={registerInputs} handleChange={handleChange} errors={errors} />
        <AuthSubmit label='Continuar' />
        <Or />
        <ContinueWithGoogle />
        <AuthFooter href={`/login`} label='¿Ya estás registrado?' hrefLabel='Haz click aquí' />
      </AuthBody>
    </>
  )
}

export default CreatePassword
