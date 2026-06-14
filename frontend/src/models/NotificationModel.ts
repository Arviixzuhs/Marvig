export enum NotificationType {
  PAYMENT_ACTIVITY = 'PAYMENT_ACTIVITY',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
  ARCHIVED = 'ARCHIVED',
}

export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[]

export interface Notification {
  id: number
  body: string
  type: NotificationType
  title: string
  status: NotificationStatus
  userId?: number
  payload: JsonValue | null
  createdAt: Date
  updatedAt: Date
}
