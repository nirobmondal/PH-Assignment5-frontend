import OrderDetailsPage from "@/components/modules/Order/OrderDetailsPage";

interface OrderDetailsRoutePageProps {
  params: {
    id: string;
  };
}

const OrderDetailsRoutePage = ({ params }: OrderDetailsRoutePageProps) => {
  return <OrderDetailsPage orderId={params.id} />;
};

export default OrderDetailsRoutePage;
