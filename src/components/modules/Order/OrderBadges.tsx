import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/types/order.types";
import {
  ORDER_STATUS_BADGE_CLASSES,
  PAYMENT_STATUS_BADGE_CLASSES,
} from "./orderUtils";

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <Badge
      variant="secondary"
      className={ORDER_STATUS_BADGE_CLASSES[status] || "bg-muted"}
    >
      {status}
    </Badge>
  );
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  return (
    <Badge
      variant="secondary"
      className={PAYMENT_STATUS_BADGE_CLASSES[status] || "bg-muted"}
    >
      {status}
    </Badge>
  );
};
