export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  clientId: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
}