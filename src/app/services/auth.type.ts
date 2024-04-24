export interface AuthResponse {
  access_token: string
  refresh_token: string
}

export interface AuthParams{
  email: string;
  password: string;
}