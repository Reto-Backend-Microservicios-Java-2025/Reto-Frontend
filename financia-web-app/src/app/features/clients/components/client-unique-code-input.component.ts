import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-unique-code-input',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './client-unique-code-input.component.html',
  styles: [`
    .center-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 16px;
    }
    .input-card {
      width: 100%;
      max-width: 400px;
      padding: 32px 20px 24px 20px;
      text-align: center;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(33,150,243,0.10), 0 1.5px 4px rgba(0,0,0,0.04);
      background: #fff;
      animation: fadeIn 0.7s;
    }
    mat-card-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 12px;
    }
    .full-width {
      width: 100%;
      margin-top: 16px;
    }
    .mat-raised-button {
      transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
      border-radius: 8px;
    }
    .mat-raised-button:hover {
      background: #e3f2fd;
      color: #1976d2;
      transform: scale(1.06);
      box-shadow: 0 2px 8px rgba(33,150,243,0.10);
    }
    .error-message {
      color: #d32f2f;
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      justify-content: center;
      animation: fadeIn 0.7s;
    }
    mat-hint {
      color: #1976d2;
      font-size: 0.95rem;
      margin-top: 4px;
    }
    @media (max-width: 600px) {
      .input-card {
        max-width: 98vw;
        padding: 16px 4px;
      }
      mat-card-title {
        font-size: 1rem;
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ClientUniqueCodeInputComponent {
  encryptedCodeInput: string = '';
  expectedEncryptedCode: string = '';
  errorMessage: string = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.expectedEncryptedCode = params['encryptedCode'] || '';
    });
  }

  onSubmit(): void {
    if (!this.encryptedCodeInput) return;
    if (this.expectedEncryptedCode && this.encryptedCodeInput !== this.expectedEncryptedCode) {
      this.errorMessage = 'El código ingresado no coincide con el código esperado.';
      return;
    }
    this.errorMessage = '';
    this.router.navigate(['/clients', this.encryptedCodeInput]);
  }
}
