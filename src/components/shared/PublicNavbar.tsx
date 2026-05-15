import { getCart } from "@/services/cart.services";
import { getUserInfo } from "@/services/auth.services";
import { UserRole } from "@/lib/authUtils";
import { ICartResponse } from "@/types/cart.types";
import { IUserResponse } from "@/types/user.types";
import PublicNavbarContent from "./PublicNavbarContent";

const PublicNavbar = async () => {
  const userInfo = (await getUserInfo()) as IUserResponse | null;
  let cartCount = 0;

  if (userInfo?.role === UserRole.CUSTOMER) {
    const cartResponse = await getCart();
    if (cartResponse?.success) {
      const cart = cartResponse.data as ICartResponse;
      cartCount = cart?.cartItems?.reduce(
        (total, item) => total + item.quantity,
        0,
      );
    }
  }

  return <PublicNavbarContent userInfo={userInfo} cartCount={cartCount} />;
};

export default PublicNavbar;
