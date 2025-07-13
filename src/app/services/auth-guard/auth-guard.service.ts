import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  accessToken: string = "access-token"
  constructor(private router: Router, private cookieService: CookieService, private snackbar: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.cookieService.get(this.accessToken)

    if (token) {
      return true;
    } else {
      this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
      this.snackbar.showError("session has been expired")
      return false;
    }
  }
}