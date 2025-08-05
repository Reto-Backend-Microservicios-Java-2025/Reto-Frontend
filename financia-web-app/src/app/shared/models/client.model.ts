export interface Client {
  id?: number; // Optional because ClientResource doesn't have id, but ClientWithProducts does
  full_name: string;
  full_last_name: string;
  type_document: string;
  number_document: string;
  uniqueCode: string | number;
}

export interface ClientForProductSelection {
  id: number; // Required for product creation
  full_name: string;
  full_last_name: string;
  type_document: string;
  number_document: string;
  uniqueCode: number;
}

export interface CreateClientRequest {
  full_name: string;
  full_last_name: string;
  type_document: string;
  number_document: string;
  uniqueCode: number;
}

export interface ClientWithProducts {
  id: number;
  full_name: string;
  full_lastName: string;
  type_document: string;
  number_document: string;
  uniqueCode: number;
  products: ClientProduct[];
}

export interface ClientProduct {
  id: number;
  productType: string;
  name: string;
  balance: number;
}