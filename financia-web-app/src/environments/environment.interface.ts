export interface Environment {
  production: boolean;
  apiUrl: string;
  endpoints: {
    auth: string;
    clients: string;
    products: string;
  };
}