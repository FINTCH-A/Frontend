export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface LoanApplication {
  id:              number;
  userId:          number;
  requestedAmount: number;
  requestedTerm:   number;
  purpose:         string | null;
  status:          ApplicationStatus;
  analystNotes:    string | null;
  reviewedAt:      string | null;
  reviewedBy:      number | null;
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

export interface PaginatedApplications {
  data: LoanApplication[];
  meta: PaginationMeta;
}

export interface ApplicationFilters {
  page?:   number;
  limit?:  number;
  status?: ApplicationStatus | '';
}

export interface ReviewApplicationInput {
  status:        ApplicationStatus;
  analystNotes?: string;
  approvedAmount?: number;
  interestRate?:   number;
}
