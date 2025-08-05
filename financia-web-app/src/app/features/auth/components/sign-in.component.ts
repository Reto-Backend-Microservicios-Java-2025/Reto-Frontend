import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';
import { SignInRequest } from '../../../shared/models/user.model';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-in.component.html',
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .auth-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
      border: 2px solid #00ff88;
      border-radius: 16px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(0, 255, 136, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 1;
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #00ff88, #00cc6a, #00ff88);
      border-radius: 16px;
      z-index: -1;
      opacity: 0.3;
      animation: borderGlow 3s ease-in-out infinite alternate;
    }

    @keyframes borderGlow {
      0% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .submit-button {
      height: 48px;
      margin-top: 16px;
      background: linear-gradient(45deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: linear-gradient(45deg, #00cc6a 0%, #00ff88 100%);
      box-shadow: 0 6px 20px rgba(0, 255, 136, 0.4);
      transform: translateY(-2px);
    }

    .submit-button:disabled {
      background: #333;
      color: #666;
      box-shadow: none;
    }

    .text-center {
      text-align: center;
      margin: 16px 0 0 0;
      color: #ffffff;
    }

    .link {
      color: #00ff88;
      cursor: pointer;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .link:hover {
      color: #00cc6a;
      text-decoration: underline;
      text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
    }

    mat-card-header {
      margin-bottom: 20px;
      text-align: center;
    }

    mat-card-title {
      color: #00ff88;
      font-size: 1.8rem;
      font-weight: 600;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      color: #cccccc;
      font-size: 1rem;
    }

    /* Material Form Field Customization for Auth */
    ::ng-deep .mat-form-field {
      color: #ffffff;
    }

    ::ng-deep .mat-form-field .mat-form-field-outline {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline-thick {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field .mat-form-field-label {
      color: #cccccc;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field input.mat-input-element {
      color: #ffffff !important;
      background-color: transparent !important;
    }

    ::ng-deep .mat-form-field textarea.mat-input-element {
      color: #ffffff !important;
      background-color: transparent !important;
    }

    ::ng-deep .mat-input-element {
      color: #ffffff !important;
      background-color: transparent !important;
    }

    ::ng-deep .mat-form-field .mat-form-field-infix {
      background-color: rgba(0, 255, 136, 0.05) !important;
      border-radius: 8px;
      padding: 8px 12px;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }

    ::ng-deep .mat-form-field .mat-form-field-infix input {
      color: #ffffff !important;
      background-color: transparent !important;
    }

    ::ng-deep .mat-form-field .mat-icon {
      color: #00ff88;
    }

    ::ng-deep .mat-form-field .mat-form-field-outline-start,
    ::ng-deep .mat-form-field .mat-form-field-outline-gap,
    ::ng-deep .mat-form-field .mat-form-field-outline-end {
      border-color: #00ff88 !important;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline-thick {
      border-color: #00ff88 !important;
    }

    ::ng-deep .mat-form-field .mat-form-field-outline-thick {
      border-color: #00ff88 !important;
    }

    ::ng-deep .mat-error {
      color: #ff6b6b;
    }

    /* Spinner customization */
    ::ng-deep .mat-spinner circle {
      stroke: #00ff88 !important;
    }

    ::ng-deep .mat-form-field input::placeholder {
      color: #666666 !important;
    }

    ::ng-deep .mat-form-field input:-webkit-input-placeholder {
      color: #666666 !important;
    }

    ::ng-deep .mat-form-field input:-moz-placeholder {
      color: #666666 !important;
    }

    ::ng-deep .mat-form-field input:-ms-input-placeholder {
      color: #666666 !important;
    }
  `]
})
export class SignInComponent {
  signInForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      this.isLoading = true;
      const request: SignInRequest = this.signInForm.value;

      this.authService.signIn(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Error al iniciar sesión. Verifica tus credenciales.', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  navigateToSignUp(): void {
    this.router.navigate(['/auth/sign-up']);
  }
}
