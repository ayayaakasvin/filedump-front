import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as validator from '../shared/validators';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
    constructor(private userService: UserService, private router: Router, private snackbar: SnackbarService) {
    }
    
    loginForm = new FormGroup({
		username: new FormControl('', [validator.usernameValidator()]),
		password: new FormControl('', [validator.passwordValidator()])
	});


    private loginSub: Subscription = new Subscription();

    ngOnInit(): void {
        this.loginSub = this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
            if (isLoggedIn) {
                this.router.navigate(["/files"]);
            }
        });
    }

    ngOnDestroy(): void {
        this.loginSub.unsubscribe();
    }

    onSubmitLogin() {
        this.userService.logInUser(this.loginForm.value.username!, this.loginForm.value.password!).subscribe(
            (_) => {
                this.router.navigate(["/files"])
            },
            (error) => {
                const errorMessage = error?.error?.message ?? 'Unknown error';
                this.snackbar.showError(`Failed to login: ${errorMessage}`)
            }
        )
    }
}