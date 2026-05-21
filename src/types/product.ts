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

export interface Order {
  orderNumber: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: 'credit-card' | 'line-pay';
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
}

