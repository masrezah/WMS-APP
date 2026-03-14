import { api } from '@/lib/api';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  category: string;
  price: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export const ProductService = {
  /**
   * Get all products
   * Optionally pass filters like category or search string
   */
  async getProducts(params?: { search?: string; category?: string }): Promise<Product[]> {
    const response = await api.get<Product[]>('/inventory/products', { params });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/inventory/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await api.post<Product>('/inventory/products', data);
    return response.data;
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await api.patch<Product>(`/inventory/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/inventory/products/${id}`);
  }
};
