import { VerificationStatus } from '@prisma/client';

export const profileSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  avatar: true,
  address: true,
  dateOfBirth: true,
  gender: true,
  bio: true,
  role: true,
  verificationStatus: true,
  cccdNumber: true,
  cccdFullName: true,
  cccdDateOfBirth: true,
  cccdGender: true,
  cccdNationality: true,
  cccdPlaceOfOrigin: true,
  cccdPlaceOfResidence: true,
  cccdIssueDate: true,
  cccdExpiryDate: true,
  cccdFrontImage: true,
  cccdBackImage: true,
  verificationNote: true,
  verifiedAt: true,
  createdAt: true,
} as const;

export type ProfileData = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  bio: string | null;
  role: 'USER' | 'ADMIN';
  verificationStatus: VerificationStatus;
  cccdNumber: string | null;
  cccdFullName: string | null;
  cccdDateOfBirth: string | null;
  cccdGender: string | null;
  cccdNationality: string | null;
  cccdPlaceOfOrigin: string | null;
  cccdPlaceOfResidence: string | null;
  cccdIssueDate: string | null;
  cccdExpiryDate: string | null;
  cccdFrontImage: string | null;
  cccdBackImage: string | null;
  verificationNote: string | null;
  verifiedAt: Date | null;
  createdAt: Date;
};
