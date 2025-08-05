import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = environment.endpoints.products;

  constructor(private httpClient: HttpClientService) {}

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.endpoint);
  }

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.endpoint}/${productId}`);
  }

  getProductsByClientId(clientId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.endpoint}/client/${clientId}`);
  }

  createProduct(request: CreateProductRequest): Observable<Product> {
    return this.httpClient.post<Product>(this.endpoint, request);
  }

  updateProduct(productId: number, request: UpdateProductRequest): Observable<Product> {
    return this.httpClient.put<Product>(`${this.endpoint}/${productId}`, request);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/${productId}`);
  }
}