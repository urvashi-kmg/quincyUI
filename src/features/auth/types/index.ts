export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
}
