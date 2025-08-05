import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ValidationUtil {
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email) return null;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email) ? null : { invalidEmail: true };
    };
  }

  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value;
      if (!phone) return null;
      
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      return phoneRegex.test(phone) ? null : { invalidPhone: true };
    };
  }

  static documentNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const doc = control.value;
      if (!doc) return null;
      
      // Basic validation for alphanumeric document numbers
      const docRegex = /^[A-Za-z0-9]+$/;
      return docRegex.test(doc) ? null : { invalidDocument: true };
    };
  }

  static priceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const price = control.value;
      if (price === null || price === undefined) return null;
      
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return { invalidPrice: true };
      }
      
      return null;
    };
  }

  static matchPasswordValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);
      
      if (!password || !confirmPassword) return null;
      
      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }
}