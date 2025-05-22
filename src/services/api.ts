import axios, { AxiosRequestConfig } from "axios";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AddCategoryRequest,
  AddSubCategoryRequest,
  ProductFormData,
  User,
  Product,
  Category,
} from "../types";

// API Configuration
const API_BASE_URL = "http://localhost:5000";

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("authToken");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  // Generic request method using Axios
  private async request<T>(
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type":
        options.data instanceof FormData ? undefined : "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await axios({
        url,
        headers,
        ...options,
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "API request failed";
      console.error("API request failed:", message);
      throw new Error(message);
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      data: credentials,
    });
    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || "Login failed");
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      data: userData,
    });
    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || "Registration failed");
  }

  async addCategory(categoryData: AddCategoryRequest): Promise<Category> {
    const response = await this.request<Category>("/api/product/add-category", {
      method: "POST",
      data: categoryData,
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to add category");
  }

  async addSubCategory(
    subCategoryData: AddSubCategoryRequest
  ): Promise<Category> {
    const response = await this.request<Category>(
      "/api/product/add-sub-category",
      {
        method: "POST",
        data: subCategoryData,
      }
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to add subcategory");
  }

  async addProduct(
    productData: ProductFormData,
    images?: File[]
  ): Promise<Product> {
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("price", productData.price.toString());
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("subcategory", productData.subcategory);
    formData.append("variants", JSON.stringify(productData.variants));
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await this.request<Product>("/api/product/add-product", {
      method: "POST",
      data: formData,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to add product");
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>("/api/auth");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to get user data");
  }

  logout() {
    this.clearToken();
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;
