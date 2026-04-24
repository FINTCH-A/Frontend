export type NotificationType =
  | 'LOAN_APPROVED'
  | 'LOAN_REJECTED'
  | 'PAYMENT_DUE'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_OVERDUE'
  | 'ACCOUNT_UPDATE'
  | 'SYSTEM_ALERT';

export interface Notification {
  id:        number;
  userId:    number;
  type:      NotificationType;
  title:     string;
  message:   string;
  isRead:    boolean;
  readAt:    string | null;
  metadata:  Record<string, unknown>;
  createdAt: string;
}

export interface PaginationMeta {
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  unread?:     number;
}

export interface PaginatedNotifications {
  data: Notification[];
  meta: PaginationMeta;
}
