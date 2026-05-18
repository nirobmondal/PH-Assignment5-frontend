import { Separator } from "@/components/ui/separator";
import { IOrder, OrderStatus } from "@/types/order.types";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";
import { formatDate, formatPrice, getOrderShortId } from "./orderUtils";
import {
  Package,
  Truck,
  Warehouse,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react";

interface OrderDetailsContentProps {
  order: IOrder;
}

// Define tracking steps with icons and labels
const trackingSteps = [
  { status: OrderStatus.PLACED, label: "Order Placed", icon: Package },
  { status: OrderStatus.PROCESSING, label: "Processing", icon: Warehouse },
  { status: OrderStatus.SHIPPED, label: "Shipped", icon: Truck },
  { status: OrderStatus.DELIVERED, label: "Delivered", icon: MapPin },
];

// Helper to get current step index
const getCurrentStepIndex = (orderStatus: OrderStatus) => {
  if (orderStatus === OrderStatus.CANCELLED) return -1;
  const index = trackingSteps.findIndex((step) => step.status === orderStatus);
  return index === -1 ? (orderStatus === OrderStatus.PENDING ? -1 : 0) : index;
};

const OrderDetailsContent = ({ order }: OrderDetailsContentProps) => {
  const canTrack = [
    OrderStatus.PLACED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
  ].includes(order.status);

  const currentStepIndex = getCurrentStepIndex(order.status);

  return (
    <div className="space-y-6">
      {/* Order header with badges */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Order ID
          </p>
          <h2 className="text-xl font-bold tracking-tight">
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

      {/* Order Tracking Timeline (only for eligible orders) */}
      {canTrack && (
        <div className="rounded-sm border bg-card p-4">
          <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Order Progress
          </h3>
          <div className="relative">
            {/* Desktop horizontal stepper */}
            <div className="hidden sm:flex items-center justify-between">
              {trackingSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full p-2 transition-all ${
                          isCompleted
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      >
                        {isCompleted && idx !== currentStepIndex ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <p
                        className={`mt-2 text-xs font-medium ${
                          isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="mt-1 text-[10px] text-primary font-semibold">
                          Current
                        </span>
                      )}
                    </div>
                    {idx < trackingSteps.length - 1 && (
                      <div
                        className={`absolute top-4 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-0.5 ${
                          idx < currentStepIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile vertical timeline */}
            <div className="sm:hidden space-y-4">
              {trackingSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full p-1.5 ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      >
                        {isCompleted && idx !== currentStepIndex ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Icon className="h-3 w-3" />
                        )}
                      </div>
                      {idx < trackingSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-8 my-1 ${
                            idx < currentStepIndex ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="text-xs text-primary font-semibold">
                          Current step
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancelled/Pending tracking message */}
      {/* {order.status === OrderStatus.CANCELLED && (
        <div className="rounded-sm border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          <XCircle className="inline-block h-4 w-4 mr-1" />
          This order has been cancelled. No tracking available.
        </div>
      )}
      {order.status === OrderStatus.PENDING && (
        <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-700">
          <Clock className="inline-block h-4 w-4 mr-1" />
          Order is pending confirmation. Tracking will appear once placed.
        </div>
      )} */}

      <Separator />

      {/* Shipping & Customer info */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 rounded-sm border p-4">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            Shipping Details
          </p>
          <div className="text-sm text-muted-foreground">
            <p className="text-foreground font-medium">{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.shippingCity}</p>
          </div>
        </div>
        <div className="space-y-2 rounded-sm border p-4">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            Customer
          </p>
          <div className="text-sm text-muted-foreground">
            <p className="text-foreground font-medium">
              {order.customer?.name}
            </p>
            <p>{order.customer?.email}</p>
            <p>{order.customer?.phone}</p>
          </div>
        </div>
      </div>

      {/* Order note */}
      {order.note && (
        <div className="rounded-sm border border-muted bg-muted/20 p-4 text-sm">
          <p className="font-medium text-foreground">Note</p>
          <p className="text-muted-foreground">{order.note}</p>
        </div>
      )}

      <Separator />

      {/* Order items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Order Items</p>
          <p className="text-sm font-semibold text-primary">
            Total {formatPrice(order.totalAmount)}
          </p>
        </div>

        <div className="space-y-4">
          {order.sellerOrders.map((sellerOrder) => (
            <div
              key={sellerOrder.id}
              className="rounded-sm border p-4 shadow-sm"
            >
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
                    className="flex flex-col gap-2 border-t pt-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.medicine?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.medicine?.dosageForm} {item.medicine?.strength}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity} x {formatPrice(item.medicine?.price ?? 0)}
                    </div>
                    <div className="font-semibold">
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

      {/* Payment & Transaction */}
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
          <p className="text-sm font-semibold">Transaction ID</p>
          <p className="text-sm text-muted-foreground break-all font-mono">
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
