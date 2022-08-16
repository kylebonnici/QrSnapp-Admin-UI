import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../services/authentication.service';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
    bMessage: boolean;
    message: string;
    username: string;
    token: string;

    newPasswordFormControl = new FormControl('',
        [
            Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$'),
            Validators.required
        ]);
    confirmPasswordFormControl = new FormControl('', [() => {
        if (this.newPasswordFormControl.value && this.newPasswordFormControl.value.trim().length > 0) {
            if (this.newPasswordFormControl.value !== this.confirmPasswordFormControl.value) {
                return {passwordMismatch: true};
            }
        }

        return null;
    }]);

    constructor(private authenticationService: AuthenticationService,
                private http: HttpClient,
                public router: Router,
                private translateService: TranslateService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.username = params.username;
            this.token = params.token;
        });
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (formControl.hasError('pattern')) {
            return this.translateService.instant('COMMON.VALIDATION.PASSWORD_NOT_SECURE');
        } else if (formControl.hasError('passwordMismatch')) {
            return this.translateService.instant('COMMON.VALIDATION.PASSWORD_MISMATCH');
        } else {
            return '';
        }
    }

    resetPasswordUrl(token: string, password: string): string {
        return this.authenticationService.serverBaseUrl + '/resetPassword?token=' + token + '&password=' + encodeURIComponent(password);
    }

    save(): void {
        this.http.put<void>(this.resetPasswordUrl(this.token, this.newPasswordFormControl.value), null)
            .subscribe(
                () => {
                    this.router.navigate(['/login']);
                }, error => {
                    if (error.status === 404) {
                        this.message = 'COMMON.MESSAGE.EXPIRED_TOKEN';
                        this.bMessage = true;
                    } else {
                        console.log(error);
                    }
                }
            );
    }

    isValid(): boolean {
        return !this.newPasswordFormControl.hasError('required') &&
            !this.newPasswordFormControl.hasError('pattern') &&
            !this.confirmPasswordFormControl.hasError('required') &&
            !this.confirmPasswordFormControl.hasError('passwordMismatch');
    }
}
