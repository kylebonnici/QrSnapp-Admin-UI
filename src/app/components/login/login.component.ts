import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FormControl, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    mode = 'determinate';

    usernameFormControl = new FormControl('', [Validators.required]);
    passwordFormControl = new FormControl('', [Validators.required]);

    constructor(private authenticationService: AuthenticationService,
                private translateService: TranslateService,
                private location: Location,
                public router: Router) {
        if (authenticationService.token) {
            authenticationService.redirectToMainPage();
        }
    }

    ngOnInit() {
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (formControl.hasError('wrongPassword')) {
            return this.translateService.instant('COMMON.VALIDATION.WRONG_USERNAME_PASSWORD');
        } else {
            return '';
        }
    }

    signup(): void {
        this.router.navigate(['/signup'],
            { queryParamsHandling: 'preserve' });
    }

    login(): void {
        this.mode = 'query';
        this.authenticationService.authenticate({
            username: this.usernameFormControl.value,
            password: this.passwordFormControl.value,
        }).then(() => {
                if (this.authenticationService.goBackOnLogin) {
                    this.location.back();
                } else {
                    this.authenticationService.redirectToMainPage();
                }
            }
        ).catch(error => {
            this.errorHandling(error);
        }).finally(() => this.mode = 'determinate');
    }

    errorHandling(error: HttpErrorResponse): void {
        if (error && error.status === 401) { // FORBIDDEN
            this.passwordFormControl.setErrors({wrongPassword: true});
        } else {
            console.log(error);
        }
    }

    forgotPassword(): void {
        this.router.navigate(['/forgot-password']);
    }
}
