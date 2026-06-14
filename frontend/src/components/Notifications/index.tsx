import React from 'react'
import { UserRole } from '@/models/UserModel'
import { IPageResponse } from '@/api/interfaces'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'
import { useMutation, useQuery } from '@apollo/client/react'
import { GET_NOTIFICATIONS_FEED } from '@/services/notification/graphql/getNotificationsFeedQuery'
import { MARK_NOTIFICATIONS_AS_READ } from '@/services/notification/graphql/markNotificationsAsReadMutation'
import { NotificationType, Notification, NotificationStatus } from '@/models/NotificationModel'
import { AlertTriangle, Bell, BellOff, CreditCard, HelpCircle } from 'lucide-react'
import { Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'

const iconMap: Record<NotificationType, React.ReactNode> = {
  [NotificationType.PAYMENT_ACTIVITY]: <CreditCard className='w-4 h-4 text-success' />,
  [NotificationType.SYSTEM_ANNOUNCEMENT]: <AlertTriangle className='w-4 h-4 text-warning' />,
}

interface NotificationsFeedData {
  findNotifications: IPageResponse<Notification>
  getUnreadNotificationsCount: number
}

const EmptyNotifications = () => (
  <div className='flex flex-col items-center justify-center py-8 gap-3 text-default-400'>
    <BellOff className='w-10 h-10' />
    <p className='text-small font-medium'>Sin notificaciones</p>
    <p className='text-tiny text-center px-4'>
      Cuando tengas notificaciones nuevas, aparecerán aquí.
    </p>
  </div>
)

export const Notifications = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { data, loading } = useQuery<NotificationsFeedData>(GET_NOTIFICATIONS_FEED, {
    variables: {
      filters: {
        userTargetRole: UserRole.ADMIN,
      },
    },
    pollInterval: 30000,
  })

  const [markAllAsRead] = useMutation(MARK_NOTIFICATIONS_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS_FEED, variables: { filters: {} } }],
  })

  const unreadCount = data?.getUnreadNotificationsCount ?? 0
  const notifications = data?.findNotifications?.content ?? []

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && unreadCount > 0) {
      markAllAsRead().catch((error) => console.error('Error marking notifications as read:', error))
    }
  }

  return (
    <div className='relative inline-block'>
      <Dropdown
        placement='bottom-end'
        className='w-80'
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        <DropdownTrigger>
          <Button isIconOnly variant='light' radius='full'>
            <Badge
              content={unreadCount}
              color='danger'
              shape='circle'
              placement='top-right'
              isInvisible={unreadCount === 0}
            >
              <Bell className='w-5 h-5 text-default-500' />
            </Badge>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          items={notifications}
          variant='flat'
          aria-label='Notificaciones del sistema'
          closeOnSelect={false}
          emptyContent={loading ? 'Cargando...' : <EmptyNotifications />}
          itemClasses={{
            base: 'gap-3 py-3',
            title: 'font-semibold text-small',
            description: 'text-tiny text-default-400 whitespace-normal',
          }}
        >
          {(notification) => {
            return (
              <DropdownItem key={notification.id} textValue={notification.title}>
                <div className='flex gap-3 items-start w-full'>
                  <div
                    className={`flex items-center justify-center min-w-8 h-8 rounded-full flex-shrink-0 ${notification.status === NotificationStatus.UNREAD ? 'bg-default-200' : 'bg-default-100'}`}
                  >
                    {iconMap[notification.type] || (
                      <HelpCircle className='w-4 h-4 text-default-400' />
                    )}
                  </div>
                  <div className='flex flex-col gap-0.5 flex-grow min-w-0'>
                    <div className='flex justify-between items-start gap-2 w-full'>
                      <p className='text-small line-clamp-1 min-w-0 font-medium'>
                        {notification.title}
                      </p>
                      {notification.status === NotificationStatus.UNREAD && (
                        <span className='w-2 h-2 mt-1.5 rounded-full bg-danger flex-shrink-0' />
                      )}
                    </div>
                    <p className='text-tiny text-default-500 whitespace-normal break-words leading-normal'>
                      {notification.body}
                    </p>
                    <span className='text-[10px] text-default-400 mt-1 font-medium'>
                      {getFormattedDateTime({
                        value: notification.createdAt,
                        format: { hour: '2-digit', minute: '2-digit' },
                      })}
                    </span>
                  </div>
                </div>
              </DropdownItem>
            )
          }}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
