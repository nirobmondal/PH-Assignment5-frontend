import { UserRole } from "@/lib/authUtils";
import { UserStatus } from "./auth.types";

export interface ISellerResponse {
  token: string;
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
  seller: {
    id: string;
    userId: string;
    shopName: string;
    shopAddress: string;
    shopPhone: string;
    createdAt: string;
    updatedAt: string;
  };
}
