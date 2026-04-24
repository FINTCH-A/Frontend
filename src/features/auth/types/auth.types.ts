export interface LoginRequest {
    email:    string;
    password: string;
  }

  export interface AuthTokens {
    accessToken:  string;
    refreshToken: string;
    tokenType:    string;
    expiresIn:    string;
  }

  export interface AuthUser {
    id:            number;
    email:         string;
    firstName:     string;
    lastName:      string;
    dni:           string;
    phone:         string;
    role:          'ADMIN' | 'ANALYST' | 'CUSTOMER';
    status:        string;
    emailVerified: boolean;
    phoneVerified: boolean;
    lastLogin:     string | null;
    createdAt:     string;
  }

  export interface ApiResponse<T> {
    success:   boolean;
    data:      T;
    timestamp: string;
  }
