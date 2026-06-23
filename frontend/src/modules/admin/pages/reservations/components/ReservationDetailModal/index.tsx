import { RootState } from '@/store'
import { ApartmentMiniCard } from '@/components/ApartmentMiniCard'
import { toggleViewItemModal } from '@/features/appTableSlice'
import { useDispatch, useSelector } from 'react-redux'
import { ReservationModel, ReservationStatus } from '@/models/ReservationModel'
import { DollarSign, Mail, Phone, User, Users } from 'lucide-react'
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
    <Modal size='4xl' isOpen={table.isViewItemModalOpen} onClose={onClose} scrollBehavior='inside'>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex justify-between items-center border-b border-neutral-100 pr-10'>
              <div className='flex items-center gap-3'>
                <span className='text-xl font-semibold text-neutral-800'>
                  Reserva #{reservation.id}
                </span>
                <Chip color={status.color} variant='flat' size='sm' className='font-semibold'>
                  {status.label}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody className='py-6 gap-6'>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  <div className={` flex flex-col gap-2`}>
                    <span className='text-sm font-medium text-muted-foreground'>
                      Información del Cliente
                    </span>
                  </div>
                  <Divider />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100'>
                  <div className='flex items-center gap-2'>
                    <User className='w-4 h-4  shrink-0' />
                    <div>
                      <p className='text-xs '>Nombre Completo</p>
                      <p className='text-sm font-medium text-neutral-700'>
                        {reservation.clientName || 'No provisto'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4  shrink-0' />
                    <div>
                      <p className='text-xs '>Teléfono</p>
                      <p className='text-sm font-medium text-neutral-700'>
                        {reservation.clientPhone || 'No provisto'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 md:col-span-2'>
                    <Mail className='w-4 h-4  shrink-0' />
                    <div>
                      <p className='text-xs '>Correo Electrónico</p>
                      <p className='text-sm font-medium text-neutral-700'>
                        {reservation.clientEmail || 'No provisto'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  <div className={` flex flex-col gap-2`}>
                    <span className='text-sm font-medium text-muted-foreground'>
                      Detalles del Hospedaje
                    </span>
                  </div>
                  <Divider />
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100'>
                  <div>
                    <p className='text-xs'>Check-In</p>
                    <p className='text-sm font-semibold text-neutral-800'>
                      {formatDate(reservation.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs'>Check-Out</p>
                    <p className='text-sm font-semibold text-neutral-800'>
                      {formatDate(reservation.endDate)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4' />
                    <div>
                      <p className='text-xs'>Huéspedes</p>
                      <p className='text-sm font-semibold text-neutral-800'>
                        {reservation.persons || 0}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <DollarSign className='w-4 h-4 text-emerald-500' />
                    <div>
                      <p className='text-xs '>Total Pagado</p>
                      <p className='text-sm font-semibold text-emerald-600'>
                        $
                        {reservation.totalPrice.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  <div className={` flex flex-col gap-2`}>
                    <span className='text-sm font-medium text-muted-foreground'>
                      Apartamentos Reservados
                    </span>
                  </div>
                  <Divider />
                </div>
                <div className='flex flex-col gap-3'>
                  {reservation.apartments && reservation.apartments.length > 0 ? (
                    reservation.apartments.map((apartment) => (
                      <ApartmentMiniCard apartment={apartment} />
                    ))
                  ) : (
                    <p className='text-xs  italic'>
                      No hay detalles de apartamentos asociados en esta respuesta.
                    </p>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className='border-t border-neutral-100'></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
