import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from '../../services/authentication.service';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    username: string;
    bOk: boolean;

    usernameFormControl = new FormControl('', [
        Validators.required]);

    constructor(private authenticationService: AuthenticationService,
                private translateService: TranslateService,
                private http: HttpClient,
                public router: Router) {
    }

    ngOnInit() {
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (formControl.hasError('wrongUsername')) {
            return this.translateService.instant('COMMON.VALIDATION.USERNAME_NOT_INUSE');
        } else {
            return '';
        }
    }


    errorHandling(error: HttpErrorResponse): void {
        this.bOk = false;

        if (error.status === 404) { // FORBIDDEN
            this.usernameFormControl.setErrors({wrongUsername: true});
        } else {
            console.log(error);
        }
    }

    requestResetPasswordTokenUrl(username: string): string {
        return this.authenticationService.serverBaseUrl + '/requestPasswordReset?username=' + encodeURIComponent(username);
    }

    forgotPassword(): void {
        this.http.put<void>(this.requestResetPasswordTokenUrl(this.usernameFormControl.value), null)
            .subscribe(() => {
                this.bOk = true;
            }, error => {
                this.errorHandling(error);
            });
    }

    isValid(): boolean {
        return !this.usernameFormControl.hasError('required') &&
            !this.usernameFormControl.hasError('wrongUsername');
    }

}
