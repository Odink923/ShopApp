export interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  isNew?: boolean;
  category?: string;
  description?: string;
}