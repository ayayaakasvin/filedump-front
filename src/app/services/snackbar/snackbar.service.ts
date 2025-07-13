import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string, duration = 4000): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };
    this.snackBar.open(message, 'Dismiss', config);
  }

  showSuccess(message: string, duration = 3000): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };
    this.snackBar.open(message, 'OK', config);
  }

  showConfirm(message: string, action: string = 'Confirm', duration = 5000): Observable<boolean> {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['snackbar-confirm'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };

    const snackRef = this.snackBar.open(message, action, config);

    return new Observable<boolean>((observer) => {
      const sub = snackRef.onAction().subscribe(() => {
        observer.next(true);  // User clicked Confirm
        observer.complete();
      });

      // If it auto-dismisses (user didn't click):
      setTimeout(() => {
        observer.next(false); // User didn't confirm
        observer.complete();
      }, duration);

      // Clean up
      return () => sub.unsubscribe();
    });
  }

}
