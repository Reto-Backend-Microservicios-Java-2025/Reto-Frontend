import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Client, CreateClientRequest, ClientWithProducts, ClientForProductSelection } from '../../../shared/models/client.model';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly endpoint = environment.endpoints.clients;

  constructor(private httpClient: HttpClientService) {}

  getAllClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.endpoint);
  }

  // Get all clients with their IDs for product creation
  // Since ClientResource doesn't have ID, we'll use uniqueCode as a temporary solution
  // In a real implementation, you might need a different endpoint that returns clients with IDs
  getAllClientsWithIds(): Observable<ClientForProductSelection[]> {
    return this.httpClient.get<Client[]>(this.endpoint).pipe(
      map(clients => clients.map(client => ({
        id: client.id ?? (typeof client.uniqueCode === 'string' ? parseInt(client.uniqueCode, 10) : client.uniqueCode),
        full_name: client.full_name,
        full_last_name: client.full_last_name,
        type_document: client.type_document,
        number_document: client.number_document,
        uniqueCode: typeof client.uniqueCode === 'string' ? parseInt(client.uniqueCode, 10) : client.uniqueCode
      })))
    );
  }

  getClientById(clientId: number): Observable<ClientWithProducts> {
    return this.httpClient.get<ClientWithProducts>(`${this.endpoint}/id/${clientId}`);
  }

  /**
   * Obtiene un cliente y sus productos usando el código cifrado.
   * @param encryptedCode Código cifrado del cliente
   */
  getClientByEncryptedCode(encryptedCode: string): Observable<ClientWithProducts> {
    return this.httpClient.get<ClientWithProducts>(`${this.endpoint}/${encryptedCode}`);
  }

  getClientBasicByEncryptedCode(encryptedCode: string): Observable<Client> {
    return this.httpClient.get<Client>(`${this.endpoint}/${encryptedCode}/basic`);
  }

  createClient(request: CreateClientRequest): Observable<Client> {
    return this.httpClient.post<Client>(this.endpoint, request);
  }

  deleteClient(clientId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/${clientId}`);
  }

  getClientIdByEncryptedCode(encryptedCode: string): Observable<number | undefined> {
    return this.getClientByEncryptedCode(encryptedCode).pipe(
      map(clientWithProducts => clientWithProducts?.id)
    );
  }

  // Utility method to encrypt uniqueCode for navigation
  encryptUniqueCode(uniqueCode: number): string {
    // AES/ECB/PKCS5Padding con clave 1234567890123456, salida Base64
    const key = CryptoJS.enc.Utf8.parse('1234567890123456');
    const encrypted = CryptoJS.AES.encrypt(uniqueCode.toString(), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString(); // Base64
  }

  // Utility method to decrypt encrypted code
  decryptCode(encryptedCode: string): number {
    // This should match your backend decryption logic
    // For now, we'll just parse as number - you might need to implement actual decryption
    return parseInt(encryptedCode, 10);
  }
}