export type UserRole   = 'ADMIN' | 'ANALYST' | 'CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User {
  id:            number;
  firstName:     string;
  lastName:      string;
  dni:           string;
  email:         string;
  phone:         string;
  dateOfBirth:   string;
  role:          UserRole;
  status:        UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin:     string | null;
  createdAt:     string;
  updatedAt:     string;
}

export interface UserFilters {
  page?:   number;
  limit?:  number;
  search?: string;
  role?:   UserRole | '';
  status?: UserStatus | '';
}

export interface PaginationMeta {
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedUsers {
  data: User[];
  meta: PaginationMeta;
}

export interface CreateUserInput {
  firstName:   string;
  lastName:    string;
  dni:         string;
  email:       string;
  phone:       string;
  dateOfBirth: string;
  password:    string;
  role?:       UserRole;
}

export interface UpdateUserInput {
  firstName?:  string;
  lastName?:   string;
  phone?:      string;
  dateOfBirth?: string;
  status?:     UserStatus;
}
