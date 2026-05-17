import { Avatar } from '@heroui/react'
import { useState } from 'react'
import { Badge, Bell, Building, CreditCard, LogOut, Plus, Shield } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'

export const ConfigPage = () => {
  const [activeSection, setActiveSection] = useState('personal')
  const user = useSelector((state: RootState) => state.user)
  const sections = [
    { id: 'personal', icon: Building, label: 'Información personal' },
    { id: 'notifs', icon: Bell, label: 'Notificaciones' },
    { id: 'payment', icon: CreditCard, label: 'Métodos de pago' },
    { id: 'security', icon: Shield, label: 'Seguridad' },
  ]

  const InputField = ({
    label,
    value,
    type = 'text',
  }: {
    label: string
    value?: string
    type?: string
  }) => (
    <div>
      <label className='text-xs text-muted-foreground font-medium mb-1 block'>{label}</label>
      <input
        type={type}
        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background outline-none focus:border-[#2B4FFF] transition-colors'
        defaultValue={value}
      />
    </div>
  )

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto px-6 py-9'>
        <h1 className='text-2xl font-extrabold mb-7'>Mi perfil</h1>
        <div className='flex gap-8'>
          {/* Profile sidebar */}
          <aside className='w-52 shrink-0'>
            <div className='text-center mb-7'>
              <div className='w-20 h-20 rounded-full bg-muted mx-auto mb-3 overflow-hidden ring-4 ring-border'>
                <Avatar className='w-full h-full object-cover' />
              </div>
              <div className='font-semibold'>
                {user?.name} {user?.lastName}
              </div>
              <div className='text-xs text-muted-foreground mt-0.5'>
                Inquilino desde {getFormattedDateTime({ value: user?.createdAt })}
              </div>
              <button className='mt-2 text-xs border border-border rounded-full px-3 py-1 hover:bg-muted transition'>
                Cambiar foto
              </button>
            </div>
            <nav className='space-y-0.5'>
              {sections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === id ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
              <div className='pt-3 mt-3 border-t border-border'>
                <button className='w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors'>
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
            </nav>
          </aside>

          {/* Content panel */}
          <div className='flex-1 bg-card border border-border rounded-2xl p-6'>
            {activeSection === 'personal' && (
              <div className='space-y-4'>
                <h2 className='font-bold mb-5'>Información personal</h2>
                <div className='grid grid-cols-2 gap-4'>
                  <InputField label='Nombre' value={user?.name} />
                  <InputField label='Apellido' value={user?.lastName} />
                </div>
                <InputField label='Correo electrónico' value={user?.email} />
                <InputField label='Teléfono' />
                <button
                  className='px-5 py-2.5 rounded-lg text-sm font-bold text-white'
                  style={{ background: '#2B4FFF' }}
                >
                  Guardar cambios
                </button>
              </div>
            )}
            {activeSection === 'notifs' && (
              <div>
                <h2 className='font-bold mb-5'>Preferencias de notificación</h2>
                <div className='space-y-0'>
                  {[
                    {
                      label: 'Confirmaciones de reserva',
                      desc: 'Recibe un correo al confirmar una reserva',
                      on: true,
                    },
                    {
                      label: 'Recordatorios de pago',
                      desc: 'Alertas 5 días antes del vencimiento',
                      on: true,
                    },
                    {
                      label: 'Novedades de la plataforma',
                      desc: 'Nuevos apartamentos y funciones',
                      on: false,
                    },
                    { label: 'Notificaciones push', desc: 'En tu navegador o celular', on: true },
                  ].map((n) => (
                    <div
                      key={n.label}
                      className='flex items-start justify-between py-4 border-b border-border last:border-0'
                    >
                      <div>
                        <div className='text-sm font-medium'>{n.label}</div>
                        <div className='text-xs text-muted-foreground mt-0.5'>{n.desc}</div>
                      </div>
                      <div
                        className={`w-11 h-6 rounded-full relative shrink-0 ml-4 transition-colors ${n.on ? 'bg-foreground' : 'bg-muted'}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${n.on ? 'right-1' : 'left-1'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSection === 'payment' && (
              <div>
                <h2 className='font-bold mb-5'>Métodos de pago</h2>
                <div className='space-y-3 mb-5'>
                  {[
                    { type: 'Visa', last4: '4231', exp: '09/27', primary: true },
                    { type: 'Mastercard', last4: '8812', exp: '03/26', primary: false },
                  ].map((c) => (
                    <div
                      key={c.last4}
                      className='flex items-center justify-between bg-muted rounded-xl p-4'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-8 bg-card border border-border rounded-md flex items-center justify-center text-xs font-black'>
                          {c.type.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className='text-sm font-medium'>
                            {c.type} •••• {c.last4}
                          </div>
                          <div className='text-xs text-muted-foreground'>Vence {c.exp}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        {c.primary && <Badge color='default'>Principal</Badge>}
                        <button className='text-xs text-muted-foreground hover:text-red-500 transition'>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className='flex items-center gap-2 text-sm font-medium'
                  style={{ color: '#2B4FFF' }}
                >
                  <Plus size={15} /> Agregar método de pago
                </button>
              </div>
            )}
            {activeSection === 'security' && (
              <div className='space-y-4'>
                <h2 className='font-bold mb-5'>Seguridad</h2>
                <InputField label='Contraseña actual' type='password' value='••••••••' />
                <InputField label='Nueva contraseña' type='password' />
                <InputField label='Confirmar nueva contraseña' type='password' />
                <button
                  className='px-5 py-2.5 rounded-lg text-sm font-bold text-white'
                  style={{ background: '#2B4FFF' }}
                >
                  Actualizar contraseña
                </button>
                <div className='border-t border-border pt-5 mt-5'>
                  <h3 className='text-sm font-semibold mb-1'>Autenticación de dos factores</h3>
                  <p className='text-xs text-muted-foreground mb-3 leading-relaxed'>
                    Añade una capa extra de seguridad a tu cuenta con verificación adicional.
                  </p>
                  <button className='text-xs border border-border rounded-lg px-4 py-2 hover:bg-muted transition font-medium'>
                    Activar 2FA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
