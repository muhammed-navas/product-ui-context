import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product, Category, CartItem, ProductFormData } from "../types";
import apiService from "../services/api";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  addProduct: (data: ProductFormData, images?: File[]) => Promise<void>;
  updateProduct: (id: string, data: ProductFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  addSubcategory: (categoryId: string, name: string) => Promise<void>;
  addToCart: (product: Product, variant: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearError: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

const initialProducts: Product[] = [
  {
    id: "1",
    title: "HP AMD Ryzen 3",
    price: 529.99,
    description:
      "The Ryzen 3 is a more high-end processor that compares to the Intel Core i3.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    category: "Laptops",
    subcategory: "HP",
    variants: [
      { ram: "4 GB", price: 529.99, quantity: 10 },
      { ram: "8 GB", price: 629.99, quantity: 5 },
      { ram: "16 GB", price: 729.99, quantity: 3 },
    ],
    inStock: true,
    rating: 4.5,
  },
  {
    id: "2",
    title: "HP AMD Ryzen 3",
    price: 529.99,
    description:
      "The Ryzen 3 is a more high-end processor that compares to the Intel Core i3.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    category: "Laptops",
    subcategory: "HP",
    variants: [
      { ram: "4 GB", price: 529.99, quantity: 8 },
      { ram: "8 GB", price: 629.99, quantity: 4 },
    ],
    inStock: true,
    rating: 4.5,
  },
  {
    id: "3",
    title: "HP AMD Ryzen 3",
    price: 529.99,
    description:
      "The Ryzen 3 is a more high-end processor that compares to the Intel Core i3.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    category: "Laptops",
    subcategory: "HP",
    variants: [
      { ram: "4 GB", price: 529.99, quantity: 15 },
      { ram: "8 GB", price: 629.99, quantity: 7 },
    ],
    inStock: true,
    rating: 4.5,
  },
];

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Laptops",
    subcategories: ["HP", "Dell", "Lenovo"],
  },
  {
    id: "2",
    name: "Tablets",
    subcategories: ["iPad", "Samsung", "Microsoft"],
  },
  {
    id: "3",
    name: "Headphones",
    subcategories: ["Sony", "Bose", "Apple"],
  },
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = async (data: ProductFormData, images?: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!data.title.trim()) {
        throw new Error("Product title is required");
      }

      if (data.price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      if (!data.category) {
        throw new Error("Category is required");
      }

      const newProduct = await apiService.addProduct(data, images);
      setProducts((prev) => [...prev, newProduct]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, data: ProductFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...data } : product
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!name.trim()) {
        throw new Error("Category name is required");
      }

      const newCategory = await apiService.addCategory({ name: name.trim() });
      setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  const addSubcategory = async (categoryId: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!name.trim()) {
        throw new Error("Subcategory name is required");
      }

      const updatedCategory = await apiService.addSubCategory({
        categoryId,
        name: name.trim(),
      });

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId ? updatedCategory : category
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add subcategory"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product, variant: any, quantity: number) => {
    const cartItem: CartItem = {
      id: `${product.id}-${variant.ram}`,
      product,
      variant,
      quantity,
    };

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === cartItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        cart,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        addSubcategory,
        addToCart,
        removeFromCart,
        clearError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
