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
