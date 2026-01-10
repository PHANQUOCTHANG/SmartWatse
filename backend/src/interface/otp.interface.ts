export interface IOtp {
  id: string;
  email: string;
  otpHash: string;
  expiresAt: Date;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
