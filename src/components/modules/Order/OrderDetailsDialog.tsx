import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IOrder } from "@/types/order.types";
import OrderDetailsContent from "./OrderDetailsContent";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
  title?: string;
}

const OrderDetailsDialog = ({
  open,
  onOpenChange,
  order,
  title = "Order Details",
}: OrderDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {order ? (
          <OrderDetailsContent order={order} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No order details available.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
