import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Client, CreateClientRequest, ClientWithProducts } from '../../../shared/models/client.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly endpoint = environment.endpoints.clients;

  constructor(private httpClient: HttpClientService) {}

  getAllClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.endpoint);
  }

  getClientById(clientId: number): Observable<ClientWithProducts> {
    return this.httpClient.get<ClientWithProducts>(`${this.endpoint}/id/${clientId}`);
  }

  getClientByEncryptedCode(encryptedCode: string): Observable<ClientWithProducts> {
    return this.httpClient.get<ClientWithProducts>(`${this.endpoint}/${encryptedCode}`);
  }

  getClientBasicByEncryptedCode(encryptedCode: string): Observable<Client> {
    return this.httpClient.get<Client>(`${this.endpoint}/${encryptedCode}/basic`);
  }

  createClient(request: CreateClientRequest): Observable<Client> {
    return this.httpClient.post<Client>(this.endpoint, request);
  }
}