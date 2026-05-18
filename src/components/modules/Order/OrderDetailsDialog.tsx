import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { IOrder } from "@/types/order.types";
import OrderDetailsContent from "./OrderDetailsContent";
import { X } from "lucide-react"; // অথবা যেকোনো close icon
import { Button } from "@/components/ui/button";

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
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-background z-10">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {order ? (
            <OrderDetailsContent order={order} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No order details available.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
