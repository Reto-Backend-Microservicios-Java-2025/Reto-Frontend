import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action: string = 'Cerrar', config?: MatSnackBarConfig): void {
    this.show(message, action, NotificationType.SUCCESS, config);
  }

  error(message: string, action: string = 'Cerrar', config?: MatSnackBarConfig): void {
    this.show(message, action, NotificationType.ERROR, { ...config, duration: 8000 });
  }

  warning(message: string, action: string = 'Cerrar', config?: MatSnackBarConfig): void {
    this.show(message, action, NotificationType.WARNING, config);
  }

  info(message: string, action: string = 'Cerrar', config?: MatSnackBarConfig): void {
    this.show(message, action, NotificationType.INFO, config);
  }

  private show(message: string, action: string, type: NotificationType, config?: MatSnackBarConfig): void {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Add CSS class based on notification type
    const panelClass = [`notification-${type}`];
    if (finalConfig.panelClass) {
      if (Array.isArray(finalConfig.panelClass)) {
        panelClass.push(...finalConfig.panelClass);
      } else {
        panelClass.push(finalConfig.panelClass);
      }
    }
    finalConfig.panelClass = panelClass;

    this.snackBar.open(message, action, finalConfig);
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}