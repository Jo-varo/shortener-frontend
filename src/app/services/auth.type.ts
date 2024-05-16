export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthParams {
  email: string;
  password: string;
}

export interface LogoutResponse {
  detail: string;
}

export interface RegisterResponse {
  detail: string;
}
