export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    role: string;
    image: string;
    status: string;
    emailVerified: boolean;
  };
  cart: {
    id: string;
    cartItems: [];
  };
}
