export interface UserPayload {
  sub: string;
  email: string;
  is_verified: boolean;
  role: string;
  iss?: string;
  exp?: number;
  iat?: number;
}

export interface GetMeResponse {
  user: UserPayload | null;
}
