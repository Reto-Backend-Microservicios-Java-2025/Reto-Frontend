export interface Client {
  full_name: string;
  full_last_name: string;
  type_document: string;
  number_document: string;
  uniqueCode: string;
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