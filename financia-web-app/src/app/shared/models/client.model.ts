export interface Client {
  id: number;
  fullName: string;
  fullLastName: string;
  typeDocument: string;
  documentNumber: string;
  uniqueCode: number;
}

export interface CreateClientRequest {
  fullName: string;
  fullLastName: string;
  typeDocument: string;
  documentNumber: string;
}

export interface ClientWithProducts extends Client {
  products: ClientProduct[];
}

export interface ClientProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}