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
  template: `
    <div class="center-container">
      <mat-card class="input-card">
        <mat-card-title>Consultar Detalles de Cliente</mat-card-title>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" autocomplete="off">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Ingrese UniqueCode Encriptado</mat-label>
              <input matInput [(ngModel)]="encryptedCodeInput" name="encryptedCodeInput" type="text" required autocomplete="off">
              <mat-hint *ngIf="expectedEncryptedCode">Sugerencia: {{ expectedEncryptedCode }}</mat-hint>
            </mat-form-field>
            <button mat-raised-button color="primary" class="full-width" [disabled]="!encryptedCodeInput">Ver Detalles</button>
            <div *ngIf="errorMessage" class="error-message">
              <mat-icon color="warn">error</mat-icon> {{ errorMessage }}
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .center-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      padding: 16px;
    }
    .input-card {
      width: 100%;
      max-width: 400px;
      padding: 24px 16px;
      text-align: center;
      box-sizing: border-box;
    }
    .full-width {
      width: 100%;
      margin-top: 16px;
    }
    .error-message {
      color: #d32f2f;
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      justify-content: center;
    }
    @media (max-width: 600px) {
      .input-card {
        max-width: 98vw;
        padding: 16px 4px;
      }
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