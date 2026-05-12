import { UserRole } from "@/lib/authUtils";
import { UserStatus } from "./auth.types";

export interface IUserResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface IUserListResponse {
  data: IUserResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
