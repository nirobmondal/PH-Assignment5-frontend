/**
 * model Order {
  id         String @id @default(uuid())
  customerId String

  totalAmount Decimal @db.Decimal(10, 2)

  status        OrderStatus   @default(PLACED)
  paymentMethod PaymentMethod @default(COD)
  paymentStatus PaymentStatus @default(UNPAID)

  shippingName    String
  shippingPhone   String
  shippingAddress String
  shippingCity    String

  note String?

  customer     User          @relation(fields: [customerId], references: [id], onDelete: Restrict)
  sellerOrders SellerOrder[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([customerId])
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
  @@map("orders")
}
 */

/**
 * const orderInclude = {
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  sellerOrders: {
    include: {
      seller: {
        select: {
          id: true,
          shopName: true,
          shopAddress: true,
          shopPhone: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              dosageForm: true,
              strength: true,
            },
          },
        },
      },
    },
  },
  payment: {
    select: {
      transactionId: true,
      stripeEventId: true,
      paymentGatewayData: true,
      createdAt: true,
    },
  },
};
 */

export enum OrderStatus {
  PENDING = "PENDING",
  PLACED = "PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export interface IOrderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ISellerUser {
  id: string;
  name: string;
  email: string;
}

export interface ISeller {
  id: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  user: ISellerUser;
}

export interface IOrderMedicine {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  dosageForm: string;
  strength: string;
}

export interface ISellerOrderItem {
  id: string;
  quantity: number;
  medicine: IOrderMedicine;
}

export interface ISellerOrder {
  id: string;
  seller: ISeller;
  items: ISellerOrderItem[];
}

export interface IOrderPayment {
  transactionId: string;
  stripeEventId: string | null;
  paymentGatewayData: unknown;

  createdAt: Date;
}

export interface IOrder {
  id: string;
  customerId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;

  customer: IOrderCustomer;
  sellerOrders: ISellerOrder[];
  payment?: IOrderPayment | null;
}

export interface IOrderResponse {
  data: IOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IPlaceOrderResponse {
  paymentUrl: string;
  sessionId: string;
  orderId: string;
}
