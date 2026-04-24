/* eslint-disable @typescript-eslint/no-explicit-any */
export type LoanStatus        = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'PAID' | 'DEFAULTED' | 'CANCELLED';
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID' | 'WAIVED';
export type PaymentStatus     = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
export type NotificationType  =
  | 'LOAN_APPROVED' | 'LOAN_REJECTED' | 'PAYMENT_DUE'
  | 'PAYMENT_RECEIVED' | 'PAYMENT_OVERDUE' | 'ACCOUNT_UPDATE' | 'SYSTEM_ALERT';

export interface Loan {
  id:                number;
  userId:            number;
  loanApplicationId: number;
  loanCode:          string;
  requestedAmount:   number;
  approvedAmount:    number;
  interestRate:      number;
  interestType:      string;
  amortization:      string;
  totalAmount:       number;
  termMonths:        number;
  currency:          string;
  disbursedAt:       string | null;
  dueDate:           string | null;
  status:            LoanStatus;
  createdAt:         string;
  updatedAt:         string;
}

export interface LoanApplication {
  id:              number;
  userId:          number;
  requestedAmount: number;
  requestedTerm:   number;
  purpose:         string | null;
  status:          ApplicationStatus;
  analystNotes:    string | null;
  reviewedAt:      string | null;
  createdAt:       string;
  updatedAt:       string;
}

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
}

export interface Payment {
  id:            number;
  userId:        number;
  loanId:        number;
  installmentId: number | null;
  amount:        number;
  currency:      string;
  status:        PaymentStatus;
  paymentDate:   string;
  reference:     string;
  notes:         string | null;
  createdAt:     string;
}

export interface Notification {
  id:        number;
  userId:    number;
  type:      NotificationType;
  title:     string;
  message:   string;
  isRead:    boolean;
  readAt:    string | null;
  metadata:  any;
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

export interface PaginatedLoans        { data: Loan[];            meta: PaginationMeta; }
export interface PaginatedApplications { data: LoanApplication[]; meta: PaginationMeta; }
export interface PaginatedInstallments { data: Installment[];     meta: PaginationMeta; }
export interface PaginatedPayments     { data: Payment[];         meta: PaginationMeta; }
export interface PaginatedNotifications{ data: Notification[];    meta: PaginationMeta; }
