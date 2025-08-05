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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .submit-button {
      height: 48px;
      margin-top: 16px;
    }

    .text-center {
      text-align: center;
      margin: 16px 0 0 0;
    }

    .link {
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    /* Material Form Field Customization for Auth */
    ::ng-deep .mat-form-field .mat-form-field-infix {
      background-color: #ffffff !important;
      border-radius: 4px;
      padding: 8px 12px;
    }

    ::ng-deep .mat-form-field input.mat-input-element {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-form-field textarea.mat-input-element {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-input-element {
      color: #333333 !important;
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-form-field .mat-form-field-infix input {
      color: #333333 !important;
      background-color: #ffffff !important;
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
