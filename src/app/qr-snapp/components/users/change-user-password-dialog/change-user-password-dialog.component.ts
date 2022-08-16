import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiError, ApiErrorCode} from '../../../models/apiError';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-change-user-password-dialog',
    templateUrl: './change-user-password-dialog.component.html',
    styleUrls: ['./change-user-password-dialog.component.scss']
})
export class ChangeUserPasswordDialogComponent {
    user: User;

    myPasswordFormControl = new FormControl('', [Validators.required]);

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

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<ChangeUserPasswordDialogComponent>,
                private userService: UserService,
                private translateService: TranslateService) {
        this.user = this.data.user;
    }

    change(): void {
        this.userService.changeUserPassword(this.user, this.myPasswordFormControl.value, this.newPasswordFormControl.value).then(() => {
            this.dialogRef.close(true);
        }).catch(error => this.errorHandling(error));
    }

    errorHandling(error: ApiError): void {
        if (error.code === ApiErrorCode.USER_NOT_FOUND) {
            // CANCEL DIALOG AS EDIT IS NOT POSSIBLE AS ITEM WAS DELETED
            this.dialogRef.close(null);
        } else if (error.code === ApiErrorCode.INVALID_PASSWORD) {
            this.myPasswordFormControl.setErrors({wrongPassword: true});
        } else if (error.code === ApiErrorCode.PASSWORD_NOT_SECURE) {
            this.newPasswordFormControl.setErrors({pattern: true});
        } else {
            console.log(error);
        }
    }

    dismiss(): void {
        this.dialogRef.close(false);
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (formControl.hasError('pattern')) {
            return this.translateService.instant('COMMON.VALIDATION.PASSWORD_NOT_SECURE');
        } else if (formControl.hasError('passwordMismatch')) {
            return this.translateService.instant('COMMON.VALIDATION.PASSWORD_MISMATCH');
        } else if (formControl.hasError('wrongPassword')) {
            return this.translateService.instant('COMMON.VALIDATION.WRONG_PASSWORD');
        } else {
            return '';
        }
    }

    isValid(): boolean {
        return !this.myPasswordFormControl.hasError('required') &&
            !this.newPasswordFormControl.hasError('required') &&
            !this.newPasswordFormControl.hasError('pattern') &&
            !this.confirmPasswordFormControl.hasError('required') &&
            !this.confirmPasswordFormControl.hasError('passwordMismatch');
    }

}
