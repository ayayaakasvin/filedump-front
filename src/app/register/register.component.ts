import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as validator from '../shared/validators';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
	selector: 'app-register',
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css' 
})
export class RegisterComponent implements OnInit {
	constructor(private userService: UserService, private router: Router, private snackbar: SnackbarService) {

	}

	private loginSub: Subscription = new Subscription();

	registerForm = new FormGroup({
		username: new FormControl('', [validator.usernameValidator()]),
		password: new FormControl('', [validator.passwordValidator()])
	});

	onSubmitRegister() {
		this.userService.registerUser(this.registerForm.value.username!, this.registerForm.value.password!).subscribe(
			(_) => {
				console.log("user registered")
				this.router.navigate(["/login"])
			},

			(error) => {
				if (error.error) {
					this.snackbar.showError(error.error.username ? error.error.username[0] : error.error.password[0])
				}
			}
		)
	}

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
}