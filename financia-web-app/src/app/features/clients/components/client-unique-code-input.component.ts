import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Ingrese UniqueCode</mat-label>
              <input matInput [(ngModel)]="uniqueCode" name="uniqueCode" type="number" required autocomplete="off">
            </mat-form-field>
            <button mat-raised-button color="primary" class="full-width" [disabled]="!uniqueCode">Ver Detalles</button>
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
    }
    .input-card {
      width: 350px;
      padding: 24px 16px;
      text-align: center;
    }
    .full-width {
      width: 100%;
      margin-top: 16px;
    }
  `]
})
export class ClientUniqueCodeInputComponent {
  uniqueCode: string = '';
  constructor(private router: Router, private clientService: ClientService) {}

  onSubmit(): void {
    if (this.uniqueCode) {
      const encrypted = this.clientService.encryptUniqueCode(Number(this.uniqueCode));
      this.router.navigate(['/clients', encrypted]);
    }
  }
}