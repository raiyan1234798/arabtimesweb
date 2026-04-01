export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  tags: string[];
  category: string;
  images: string[];
  createdAt: string; // ISO string or timestamp
  trending?: boolean;
  newArrival?: boolean;
  discount?: number; // percentage
  rating?: number;
  reviews?: number;
}


export interface CartItem extends Product {
  quantity: number;
}
