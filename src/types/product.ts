export interface Product {
  id: number;
  name: string;
  englishName: string;
  price: number;
  imageUrl: string;
  description: string;
  specs: string[];
  details: string;
  gallery: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'credit-card' | 'line-pay';
export type OrderStatus = 'pending' | 'payment_pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export interface Order {
  orderNumber: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
}

export interface CreateOrderRequest {
  returnUrl: string;
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  paymentMethod: PaymentMethod;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface CreateOrderResponse {
  order: Order;
  paymentUrl?: string;
}
