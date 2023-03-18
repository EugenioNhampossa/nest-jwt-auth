export type userPayload = {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
  refreshToken?: string;
  accessToken?: string;
};
