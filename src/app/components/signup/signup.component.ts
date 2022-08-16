import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {User} from '../../qr-snapp/models/user';
import {AuthenticationService} from '../../services/authentication.service';
import {ApiError, ApiErrorCode} from '../../qr-snapp/models/apiError';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    mode = 'determinate';

    bOk = false;
    name = new FormControl('', [Validators.required]);
    surname = new FormControl('', [Validators.required]);
    email = new FormControl('', [
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')]);
    username = new FormControl('', [Validators.required]);
    newPassword = new FormControl('',
        [
            Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$'),
            Validators.required
        ]);
    confirmPassword = new FormControl('', [() => {
        if (this.newPassword.value && this.newPassword.value.trim().length > 0) {
            if (this.newPassword.value !== this.confirmPassword.value) {
                return {passwordMismatch: true};
            }
        }

        return null;
    }]);

    constructor(private translateService: TranslateService,
                private authenticationService: AuthenticationService,
                public router: Router) {
    }

    ngOnInit() {
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (formControl.hasError('pattern') && (formControl === this.newPassword || formControl === this.confirmPassword)) {
            return this.translateService.instant('COMMON.VALIDATION.PASSWORD_NOT_SECURE');
        } else if (formControl.hasError('passwordMismatch')) {
            return this.translateService.instant('COMMON.VALIDATION.PASSWORD_MISMATCH');
        } else if (formControl.value && formControl.hasError('pattern') && formControl === this.email) {
            return this.translateService.instant('COMMON.VALIDATION.NOT_AN_EMAIL');
        } else if (formControl.hasError('notUnique')) {
            return this.translateService.instant('COMMON.VALIDATION.NOT_UNIQUE');
        } else {
            return '';
        }
    }

    signUpPasswordUrl(password: string): string {
        return '/signup/?password=' + encodeURIComponent(password);
    }

    signup(): void {
        this.mode = 'query';

        const user = new User();
        user.name = this.name.value;
        user.surname = this.surname.value;
        user.username = this.username.value;
        user.email = this.email.value;

        this.authenticationService.postNoHeader<User>(this.signUpPasswordUrl(this.newPassword.value), user,
            () => this.bOk = true,
            apiError => this.errorHandling(apiError),
            () => this.mode = 'determinate'
        );
    }

    errorHandling(error: ApiError): void {
        if (error.code === ApiErrorCode.DUPLICATE_USERNAME) {
            this.username.setErrors({notUnique: true});
        } else if (error.code === ApiErrorCode.DUPLICATE_EMAIL) {
            this.email.setErrors({notUnique: true});
        } else if (error.code === ApiErrorCode.PASSWORD_NOT_SECURE) {
            this.newPassword.setErrors({pattern: true});
        } else {
            console.log(error);
        }
    }

    login(): void {
        this.router.navigate(['/login'], {queryParamsHandling: 'preserve'});
    }

    isValid(): boolean {
        return !this.name.hasError('required') &&
            !this.surname.hasError('required') &&
            !this.username.hasError('required') &&
            !this.email.hasError('required') &&
            !this.newPassword.hasError('required') &&
            !this.confirmPassword.hasError('required') &&
            !this.username.hasError('notUnique') &&
            !this.email.hasError('notUnique') &&
            !this.email.hasError('pattern') &&
            !this.newPassword.hasError('pattern') &&
            !this.confirmPassword.hasError('passwordMismatch');
    }
}
