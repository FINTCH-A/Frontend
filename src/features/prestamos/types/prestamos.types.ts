export type LoanStatus       = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'PAID' | 'DEFAULTED' | 'CANCELLED';
export type InterestType     = 'FIXED' | 'VARIABLE';
export type AmortizationType = 'FRENCH' | 'GERMAN';

export interface Loan {
  id:                number;
  userId:            number;
  loanApplicationId: number;
  loanCode:          string;
  requestedAmount:   number;
  approvedAmount:    number;
  interestRate:      number;
  interestType:      InterestType;
  amortization:      AmortizationType;
  totalAmount:       number;
  termMonths:        number;
  currency:          string;
  disbursedAt:       string | null;
  dueDate:           string | null;
  status:            LoanStatus;
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

export interface PaginatedLoans {
  data: Loan[];
  meta: PaginationMeta;
}

export interface LoanFilters {
  page?:   number;
  limit?:  number;
  status?: LoanStatus | '';
}

export interface CreateLoanInput {
  loanApplicationId: number;
  approvedAmount:    number;
  interestRate:      number;
  interestType?:     InterestType;
  amortization?:     AmortizationType;
}
