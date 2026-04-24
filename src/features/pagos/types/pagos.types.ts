export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface Payment {
  id:              number;
  userId:          number;
  loanId:          number;
  installmentId:   number | null;
  paymentMethodId: number | null;
  amount:          number;
  currency:        string;
  status:          PaymentStatus;
  paymentDate:     string;
  reference:       string;
  notes:           string | null;
  createdAt:       string;
  updatedAt:       string;
}

export interface PaginationMeta {
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedPayments {
  data: Payment[];
  meta: PaginationMeta;
}

export interface PaymentFilters {
  page?:   number;
  limit?:  number;
  status?: PaymentStatus | '';
  loanId?: number;
}

export interface CreatePaymentInput {
  loanId:          number;
  installmentId?:  number;
  paymentMethodId?: number;
  amount:          number;
  notes?:          string;
}
