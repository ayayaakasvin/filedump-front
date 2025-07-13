import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	public userLoggedIn: boolean = false;
	private subscription!: Subscription;

	constructor(private userService: UserService, private router: Router, private snackbar: SnackbarService) { }

	ngOnInit(): void {
		this.subscription = this.userService.isLoggedIn$.subscribe(
			(value: boolean) => {
				this.userLoggedIn = value;
			}
		);
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	confirmLogout(): void {
		this.snackbar.showConfirm("Are you sure to logout?").subscribe(
			(confirmed) => {
				if(confirmed) {
					this.onClickLogout();
				} else {
					console.log("log out cancelled");
				}
			}
		);
	}

	onClickLogout() {
		this.userService.logOutUser().subscribe(
			(_) => {
				this.router.navigate(["/login"])
				this.snackbar.showSuccess("logged out")	
			},
			(error) => {
				console.error(error)
			}
		)
	}
}