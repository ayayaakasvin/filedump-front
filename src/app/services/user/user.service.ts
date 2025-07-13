import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ApiResponse } from '../../interfaces/api-response';
import { SnackbarService } from '../snackbar/snackbar.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private backendURL: string = environment.apiUrl;
    private loggedInSubject = new BehaviorSubject<boolean>(false);

    get isLoggedIn$(): Observable<boolean> {
        return this.loggedInSubject.asObservable();
    }

    setLoggedIn(value: boolean): void {
        this.loggedInSubject.next(value);
    }

    constructor(private http: HttpClient, private cookieService: CookieService, private snackbar: SnackbarService) {
        const hasToken = this.cookieService.check("access-token")
        this.setLoggedIn(hasToken)
    }

    logInUser(username: string, password: string): Observable<ApiResponse<{ "access-token": string, "refresh-token": string }>> {
        return this.http.post<ApiResponse<{ "access-token": string, "refresh-token": string }>>(
            `${this.backendURL}/login`,
            { username, password }
        ).pipe(
            tap({
                next: (resp) => {
                    if (!resp.data?.['access-token']) {
                        console.error("No token provided");
                        throw new Error("Invalid response structure");
                    }

                    this.cookieService.set("access-token", resp.data['access-token'], {
                        expires: 1 / (24 * 4),
                        path: "/",
                        secure: false,
                        sameSite: 'Lax'
                    });
                    this.cookieService.set("refresh-token", resp.data['refresh-token'], {
                        expires: 15,
                        path: "/",
                        secure: false,
                        sameSite: 'Lax'
                    });
                    this.setLoggedIn(true);
                },
                error: (err) => {
                    if (err.status === 400) {
                        console.error("Login failed: bad request");
                        this.snackbar.showError("Incorrect username or password");
                    } else {
                        console.error("Unexpected login error", err);
                    }
                }
            })
        );
    }


    registerUser(username: string, password: string): Observable<ApiResponse<null>> {
        return this.http.post<ApiResponse<null>>(`${this.backendURL}/register`, {
            username, password
        }).pipe(
            tap({
                error: (err) => {
                    if (err.status === 400) {
                        console.error("Register failed: bad request");
                    } else {
                        console.error("Unexpected register error", err);
                    }
                }
            })
        )
    }

    logOutUser(): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.backendURL}/logout`).pipe(
            tap({
                next: () => {
                    this.cookieService.delete("access-token", "/");
                    this.cookieService.delete("refresh-token", "/");
                    this.setLoggedIn(false);
                },
                error: (err) => {
                    console.error("Logout error", err);
                    this.cookieService.delete("access-token", "/");
                    this.cookieService.delete("refresh-token", "/");
                    this.setLoggedIn(false);
                }
            })
        );
    }

    refreshToken(refreshToken: string): Observable<ApiResponse<{ "access-token": string }>> {
        return this.http.post<ApiResponse<{ "access-token": string }>>(`${this.backendURL}/refresh`,
            {refreshToken}
        ).pipe(
            tap({
                next: (resp) => {
                    if (!resp.data?.['access-token']) {
                        console.error("No token provided");
                        throw new Error("Invalid response structure");
                    }

                    this.cookieService.set("access-token", resp.data['access-token'], {
                        expires: 1 / (24 * 4),
                        path: "/",
                        secure: false,
                        sameSite: 'Lax'
                    });
                    this.setLoggedIn(true);
                },
                error: (err) => {
                    if (err.status == 401) {
                        console.error("Login failed: bad request");
                        this.snackbar.showError("Failed to refresh token");
                    } else {
                        console.error("Unexpected refresh error", err);
                    }
                    this.setLoggedIn(false)
                }
            })
        )
    }
}
