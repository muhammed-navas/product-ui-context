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
  Category
} from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Generic request method
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  // Product endpoints
  async addCategory(categoryData: AddCategoryRequest): Promise<Category> {
    const response = await this.request<Category>('/api/product/add-category', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add category');
  }

  async addSubCategory(subCategoryData: AddSubCategoryRequest): Promise<Category> {
    const response = await this.request<Category>('/api/product/add-sub-category', {
      method: 'POST',
      body: JSON.stringify(subCategoryData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add subcategory');
  }

  async addProduct(productData: ProductFormData, images?: File[]): Promise<Product> {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add product data
    formData.append('title', productData.title);
    formData.append('price', productData.price.toString());
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('subcategory', productData.subcategory);
    formData.append('variants', JSON.stringify(productData.variants));
    
    // Add images if provided
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    const response = await this.request<Product>('/api/product/add-product', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add product');
  }

  // Get current user (if needed)
  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/api/auth/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get user data');
  }

  // Logout
  logout() {
    this.clearToken();
  }
}

// Create and export API service instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
