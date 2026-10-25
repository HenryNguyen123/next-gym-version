import {
  FitnessGoalEnum,
  FitnessLevelEnum,
  GenderEnum,
  PrivacySettingEnum,
} from "@/lib/enums/profile.enum";

export interface UserRole {
  name: string;
  code: string;
  description?: string;
  createdAt?: string;
}

export interface ProfileData {
  id: number;
  fullName: string;
  avatar?: string;
  avatarPublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  bio?: string;
  gender?: GenderEnum;
  birthday?: string;
  phone?: string;
  height?: number;
  weight?: number;
  bodyFat?: number;
  goal?: FitnessGoalEnum;
  fitnessLevel: FitnessLevelEnum;
  experienceYears: number;
  city?: string;
  country?: string;
  privacySetting: PrivacySettingEnum;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: number;
  userName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  status: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile: ProfileData;
  roles: UserRole[];
}