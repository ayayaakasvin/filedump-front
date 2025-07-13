import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, switchMap, throwError, tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UnauthorizedInterceptorService implements HttpInterceptor {
	constructor(
		private cookieService: CookieService,
		private userService: UserService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (req.url.includes("/login") || req.url.includes("/logout")) {
			return next.handle(req);
		}

		return next.handle(req).pipe(
			catchError((error) => {
				if (error.status === 401) {
					console.warn("Unauthorized request");

					const refreshToken = this.cookieService.get("refresh-token");

					if (!refreshToken) {
						this.handleLogout();
						return throwError(() => error);
					}

					return this.userService.refreshToken(refreshToken).pipe(
						switchMap((access) => {
							const newToken = access.data?.['access-token'];
							if (!newToken) {
								this.handleLogout();
								return throwError(() => new Error("Failed to get new access token"));
							}

							const newReq = req.clone({
								setHeaders: { Authorization: `Bearer ${newToken}` }
							});
							return next.handle(newReq);
						}),
						catchError(err => {
							this.handleLogout();
							return throwError(() => err);
						})
					);
				}

				return throwError(() => error);
			})
		);
	}

	private handleLogout() {
		this.userService.logOutUser().subscribe(() => {
			this.router.navigate(["/login"], {
				queryParams: { returnURL: this.route.snapshot.toString() }
			});
		});
	}
}
