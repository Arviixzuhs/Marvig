import { RootState } from '@/store'
import { ApartmentMiniCard } from '@/components/ApartmentMiniCard'
import { toggleViewItemModal } from '@/features/appTableSlice'
import { useDispatch, useSelector } from 'react-redux'
import { ReservationModel, ReservationStatus } from '@/models/ReservationModel'
import { PaymentMethod, PaymentStatus } from '@/models/PaymentModel' // Ajusta la ruta de tus modelos si es distinta
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Hash,
  Mail,
  Phone,
  User,
  Users,
} from 'lucide-react'
import {
  Chip,
  Modal,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from '@heroui/react'

const statusConfig: Record<
  ReservationStatus,
  { label: string; color: 'warning' | 'success' | 'danger' | 'default' }
> = {
  [ReservationStatus.PENDING]: { label: 'Pendiente', color: 'warning' },
  [ReservationStatus.CONFIRMED]: { label: 'Confirmado', color: 'success' },
  [ReservationStatus.CANCELLED]: { label: 'Cancelado', color: 'danger' },
  [ReservationStatus.COMPLETED]: { label: 'Completado', color: 'default' },
}

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: 'warning' | 'success' | 'danger' | 'default' }
> = {
  [PaymentStatus.PENDING]: { label: 'Pendiente', color: 'warning' },
  [PaymentStatus.CONFIRMED]: { label: 'Confirmado', color: 'success' },
  [PaymentStatus.FAILED]: { label: 'Fallido', color: 'danger' },
  [PaymentStatus.CANCELLED]: { label: 'Cancelado', color: 'default' },
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.PAYPAL]: 'PayPal',
  [PaymentMethod.STRIPE]: 'Stripe',
  [PaymentMethod.PAGO_MOVIL]: 'Pago Móvil',
  [PaymentMethod.DEBIT_CARD]: 'Tarjeta de Débito',
  [PaymentMethod.CREDID_CARD]: 'Tarjeta de Crédito',
  [PaymentMethod.BANK_TRANSFER]: 'Transferencia Bancaria',
}

interface ReservationDetailModalProps {
  reservation: ReservationModel | null | undefined
}

export const ReservationDetailModal = ({ reservation }: ReservationDetailModalProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  if (!reservation) return null

  const formatDate = (dateStr: Date | string) => {
    const d = new Date(dateStr)
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
  }

  const status = statusConfig[reservation.status]

  const onClose = () => dispatch(toggleViewItemModal(null))

  return (
    <Modal
      size='4xl'
      isOpen={table.isViewItemModalOpen}
      onClose={onClose}
      scrollBehavior='inside'
      backdrop='blur'
    >
      <ModalContent className='bg-card text-foreground'>
        {() => (
          <>
            <ModalHeader className='flex justify-between items-center pr-10'>
              <div className='flex items-center gap-3'>
                <span className='text-xl font-semibold text-foreground'>
                  Reserva #{reservation.id}
                </span>
                <Chip color={status.color} variant='flat' size='sm' className='font-semibold'>
                  {status.label}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              {/* Información del Cliente */}
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium text-muted-foreground'>
                    Información del Cliente
                  </span>
                  <Divider className='bg-border' />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-default-50 border border-default-100/50 p-4 rounded-xl'>
                  <div className='flex items-center gap-2'>
                    <User className='w-4 h-4 text-muted-foreground shrink-0' />
                    <div>
                      <p className='text-xs text-muted-foreground'>Nombre Completo</p>
                      <p className='text-sm font-medium text-foreground'>
                        {reservation.clientName || 'No provisto'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4 text-muted-foreground shrink-0' />
                    <div>
                      <p className='text-xs text-muted-foreground'>Teléfono</p>
                      <p className='text-sm font-medium text-foreground'>
                        {reservation.clientPhone || 'No provisto'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 md:col-span-2'>
                    <Mail className='w-4 h-4 text-muted-foreground shrink-0' />
                    <div>
                      <p className='text-xs text-muted-foreground'>Correo Electrónico</p>
                      <p className='text-sm font-medium text-foreground break-all'>
                        {reservation.clientEmail || 'No provisto'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles del Hospedaje */}
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium text-muted-foreground'>
                    Detalles del Hospedaje
                  </span>
                  <Divider className='bg-border' />
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 bg-default-50 p-4 rounded-xl border border-default-100/50'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Check-In</p>
                    <p className='text-sm font-semibold text-foreground'>
                      {formatDate(reservation.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Check-Out</p>
                    <p className='text-sm font-semibold text-foreground'>
                      {formatDate(reservation.endDate)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-muted-foreground' />
                    <div>
                      <p className='text-xs text-muted-foreground'>Huéspedes</p>
                      <p className='text-sm font-semibold text-foreground'>
                        {reservation.persons || 0}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <DollarSign className='w-4 h-4 text-emerald-500 dark:text-emerald-400' />
                    <div>
                      <p className='text-xs text-muted-foreground'>Total</p>
                      <p className='text-sm font-semibold text-emerald-600 dark:text-emerald-400'>
                        $
                        {reservation.totalPrice.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apartamentos Reservados */}
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium text-muted-foreground'>
                    Apartamentos Reservados
                  </span>
                  <Divider className='bg-border' />
                </div>
                <div className='flex flex-col gap-3'>
                  {reservation.apartments && reservation.apartments.length > 0 ? (
                    reservation.apartments.map((apartment) => (
                      <ApartmentMiniCard key={apartment.id} apartment={apartment} />
                    ))
                  ) : (
                    <p className='text-xs text-muted-foreground italic opacity-80'>
                      No hay detalles de apartamentos asociados en esta respuesta.
                    </p>
                  )}
                </div>
              </div>

              {/* Datos del Pago */}
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium text-muted-foreground'>Datos del Pago</span>
                  <Divider className='bg-border' />
                </div>
                <div className='flex flex-col gap-3'>
                  {reservation.payments && reservation.payments.length > 0 ? (
                    reservation.payments.map((payment) => {
                      const payStatus = paymentStatusConfig[payment.status] || {
                        label: payment.status,
                        color: 'default',
                      }

                      return (
                        <div
                          key={payment.id}
                          className='flex flex-col gap-3 bg-default-50 border border-default-100/50 p-4 rounded-xl'
                        >
                          <div className='flex justify-between items-center pb-2 border-b border-default-100/60'>
                            <div className='flex items-center gap-2'>
                              <span className='text-xs font-semibold text-muted-foreground'>
                                Pago #{payment.id}
                              </span>
                              <Chip
                                color={payStatus.color}
                                variant='flat'
                                size='sm'
                                className='font-semibold'
                              >
                                {payStatus.label}
                              </Chip>
                            </div>
                            <span className='text-base font-bold text-emerald-600 dark:text-emerald-400'>
                              $
                              {payment.amount.toLocaleString('es-ES', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                            <div className='flex items-center gap-2'>
                              <CreditCard className='w-4 h-4 text-muted-foreground shrink-0' />
                              <div>
                                <p className='text-xs text-muted-foreground'>Método</p>
                                <p className='text-sm font-medium text-foreground'>
                                  {paymentMethodLabels[payment.method] || payment.method}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-center gap-2'>
                              <Calendar className='w-4 h-4 text-muted-foreground shrink-0' />
                              <div>
                                <p className='text-xs text-muted-foreground'>Fecha de Pago</p>
                                <p className='text-sm font-medium text-foreground'>
                                  {formatDate(payment.date)}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-center gap-2'>
                              <Hash className='w-4 h-4 text-muted-foreground shrink-0' />
                              <div>
                                <p className='text-xs text-muted-foreground'>Referencia</p>
                                <p className='text-sm font-medium text-foreground break-all'>
                                  {payment.reference || 'N/A'}
                                </p>
                              </div>
                            </div>

                            {payment.description && (
                              <div className='flex items-center gap-2 md:col-span-3 pt-1'>
                                <FileText className='w-4 h-4 text-muted-foreground shrink-0' />
                                <div>
                                  <p className='text-xs text-muted-foreground'>Descripción</p>
                                  <p className='text-sm font-medium text-foreground'>
                                    {payment.description}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className='text-xs text-muted-foreground italic opacity-80'>
                      No hay registros de pagos asociados a esta reserva.
                    </p>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  )
}