export const environment = {
  production: true,
  apiUrl: 'http://localhost:8010',
  endpoints: {
    auth: '/iam-service/api/v1/users',
    clients: '/customer-service/api/v1/clients',
    products: '/product-service/api/v1/products'
  }
};