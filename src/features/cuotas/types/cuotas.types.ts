export type InstallmentStatus =
  | 'PENDING'
  | 'PAID'
  | 'OVERDUE'
  | 'PARTIALLY_PAID'
  | 'WAIVED';

export interface Installment {
  id:                number;
  loanId:            number;
  installmentNumber: number;
  principalAmount:   number;
  interestAmount:    number;
  totalAmount:       number;
  paidAmount:        number;
  pendingAmount:     number;
  currency:          string;
  dueDate:           string;
  paidAt:            string | null;
  status:            InstallmentStatus;
  lateFee:           number | null;
  daysOverdue:       number;
  isOverdue:         boolean;
  createdAt:         string;
  updatedAt:         string;
}

export interface PaginationMeta {
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedInstallments {
  data: Installment[];
  meta: PaginationMeta;
}
