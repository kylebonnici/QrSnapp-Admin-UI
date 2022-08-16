import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../services/authentication.service';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
    selector: 'app-set-first-password',
    templateUrl: './set-first-password.component.html',
    styleUrls: ['./set-first-password.component.scss']
})
export class SetFirstPasswordComponent implements OnInit {
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
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.username = params.username;
            this.token = params.token;
        });
    }

    activateWithPasswordUrl(token: string, password: string, username: string): string {
        return this.authenticationService.serverBaseUrl + '/activateWithPassword?token=' + token + '&password=' +
            encodeURIComponent(password) + '&username=' + encodeURIComponent(username);
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return 'You must enter a value';
        } else if (formControl.hasError('pattern')) {
            return 'Password is not secure';
        } else if (formControl.hasError('passwordMismatch')) {
            return 'Passwords do not match';
        } else {
            return '';
        }
    }

    save(): void {
        this.http.put<void>(this.activateWithPasswordUrl(this.token, this.newPasswordFormControl.value, this.username), null)
            .subscribe(
                () => {
                    this.router.navigate(['/login']);
                }, error => {
                    if (error.status === 404) {
                        this.message = 'COMMON.MESSAGE.EXPIRED_TOKEN';
                        this.bMessage = true;
                    } else if (error.status === 406) {
                        this.router.navigate(['/login']);
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
