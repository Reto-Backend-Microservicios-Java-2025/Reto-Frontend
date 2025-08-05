export interface Product {
  id: number;
  clientId: number;
  productType: string;
  name: string;
  balance: number;
}

export interface CreateProductRequest {
  clientId: number;
  productType: string;
  name: string;
  balance: number;
}

export interface UpdateProductRequest {
  productType?: string;
  name?: string;
  balance?: number;
}