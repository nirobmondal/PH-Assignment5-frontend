import { UserRole } from "@/lib/authUtils";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

export interface IRegisterResponse {
  user: {
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    role: UserRole;
    status: UserStatus;
    phone: string | null;
    id: string;
  };
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    role: UserRole;
    status: UserStatus;
    phone: string | null;
    id: string;
  };
}

export interface IChangePasswordResponse extends ILoginResponse {}
