export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  accepted: boolean;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

export type SocialProvider = 'facebook' | 'google';

export interface SocialLoginRequest {
  provider: SocialProvider;
}

export interface OAuthRedirectResponse {
  authorizationUrl: string;
}

export type SocialLoginResponse = AuthResponse | OAuthRedirectResponse;

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
  user: AuthUser;
}
