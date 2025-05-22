
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  variants: ProductVariant[];
  inStock: boolean;
  rating: number;
}

export interface ProductVariant {
  ram: string;
  price: number;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export interface ProductFormData {
  title: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  variants: ProductVariant[];
  image: string;
}
