// frontend-avante/src/features/credit-score/types/credit-score.types.ts

export interface CreditScore {
  id: number;
  userId: number;
  score: number;
  riskLevel: string;
  riskLabel?: string;
  scoreLabel?: string;
  paymentHistory: number | null;
  debtRatio: number | null;
  maxLoanAmount: number | null;
  notes: string | null;
  evaluatedAt: string;
  expiresAt: string | null;
  isExpired?: boolean;
  createdAt: string;
}

export interface PaginatedCreditScores {
  data: CreditScore[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateCreditScoreInput {
  score: number;
  riskLevel: string;
  paymentHistory?: number;
  debtRatio?: number;
  maxLoanAmount?: number;
  notes?: string;
  expiresAt?: string;
}
