import { Separator } from "@/components/ui/separator";
import { IOrder } from "@/types/order.types";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";
import { formatDate, formatPrice, getOrderShortId } from "./orderUtils";

interface OrderDetailsContentProps {
  order: IOrder;
}

const OrderDetailsContent = ({ order }: OrderDetailsContentProps) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Order</p>
          <h2 className="text-xl font-semibold">
            #{getOrderShortId(order.id)}
          </h2>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Shipping Details</p>
          <div className="text-sm text-muted-foreground">
            <p className="text-foreground font-medium">{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.shippingCity}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Customer</p>
          <div className="text-sm text-muted-foreground">
            <p className="text-foreground font-medium">
              {order.customer?.name}
            </p>
            <p>{order.customer?.email}</p>
            <p>{order.customer?.phone}</p>
          </div>
        </div>
      </div>

      {order.note && (
        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          <p className="font-medium text-foreground">Note</p>
          <p className="text-muted-foreground">{order.note}</p>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Order Items</p>
          <p className="text-sm text-muted-foreground">
            Total {formatPrice(order.totalAmount)}
          </p>
        </div>

        <div className="space-y-4">
          {order.sellerOrders.map((sellerOrder) => (
            <div key={sellerOrder.id} className="rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {sellerOrder.seller?.shopName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sellerOrder.seller?.shopPhone}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatPrice(sellerOrder.subtotal)}
                </p>
              </div>

              <div className="mt-3 space-y-3">
                {sellerOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.medicine?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.medicine?.dosageForm} {item.medicine?.strength}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity} x {formatPrice(item.medicine?.price ?? 0)}
                    </div>
                    <div className="text-sm font-semibold">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Payment</p>
          <p className="text-sm text-muted-foreground">
            {order.paymentStatus === "PAID"
              ? "Payment completed"
              : "Payment pending"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Transaction</p>
          <p className="text-sm text-muted-foreground">
            {order.paymentStatus === "PAID" && order.payment?.transactionId
              ? order.payment.transactionId
              : "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsContent;
