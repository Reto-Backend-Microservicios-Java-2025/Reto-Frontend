import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { User, SignInRequest, SignUpRequest, AuthenticationResponse } from '../../../shared/models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private httpClient: HttpClientService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  signUp(request: SignUpRequest): Observable<AuthenticationResponse> {
    return this.httpClient.post<AuthenticationResponse>(
      `${environment.endpoints.auth}/sign-up`,
      request
    ).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  signIn(request: SignInRequest): Observable<AuthenticationResponse> {
    return this.httpClient.post<AuthenticationResponse>(
      `${environment.endpoints.auth}/sign-in`,
      request
    ).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  getCurrentUser(): Observable<User> {
    return this.httpClient.get<User>(`${environment.endpoints.auth}/me`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private setAuthData(response: AuthenticationResponse): void {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}