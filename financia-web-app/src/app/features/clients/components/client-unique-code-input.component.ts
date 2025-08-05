import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-unique-code-input',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="center-container">
      <mat-card class="input-card">
        <mat-card-title>Consultar Detalles de Cliente</mat-card-title>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" autocomplete="off">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Ingrese UniqueCode</mat-label>
              <input matInput [(ngModel)]="uniqueCode" name="uniqueCode" type="number" required autocomplete="off">
            </mat-form-field>
            <button mat-raised-button color="primary" class="full-width" [disabled]="!uniqueCode">Ver Detalles</button>
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
  uniqueCode: string = '';
  errorMessage: string = '';
  expectedUniqueCode: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private clientService: ClientService) {
    this.route.queryParams.subscribe(params => {
      this.expectedUniqueCode = params['uniqueCode'] || '';
    });
  }

  onSubmit(): void {
    if (!this.uniqueCode) return;
    if (this.expectedUniqueCode && this.uniqueCode !== this.expectedUniqueCode) {
      this.errorMessage = 'El UniqueCode ingresado no corresponde al cliente seleccionado.';
      return;
    }
    this.errorMessage = '';
    const encrypted = this.clientService.encryptUniqueCode(Number(this.uniqueCode));
    this.router.navigate(['/clients', encrypted]);
  }
}