import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AccountState, User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ApiError, ApiErrorCode} from '../../../models/apiError';
import {TranslateService} from '@ngx-translate/core';
import {ValueDataPair} from '../../../models/ui/valueDataPair';

@Component({
    selector: 'app-user-add-edit-dialog',
    templateUrl: './user-add-edit-dialog.component.html',
    styleUrls: ['./user-add-edit-dialog.component.scss']
})
export class UserAddEditDialogComponent implements OnInit {
    loggedInUser: User;
    oldUserName: string;
    user: User;
    originalUser: User;
    title: string;
    bEdit: boolean;
    name = new FormControl('', [Validators.required]);
    surname = new FormControl('', [Validators.required]);
    username = new FormControl('', [
        Validators.required]);
    email = new FormControl('', [
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')]);

    fromValid = new FormControl('', [() => {
        if (this.user) {
            if (this.fromValid.value && this.toValid.value) {
                if (this.fromValid.value >= this.toValid.value) {
                    return {notValidDatesRange: true};
                }

                setTimeout( () => {
                    if (this.toValid.hasError('notValidDatesRange')) {
                        this.toValid.setValue(this.toValid.value);
                    }
                }, 1);
            }
        }
        return null;
    }]);

    toValid = new FormControl('', [() => {
        if (this.user) {
            if (this.fromValid.value && this.toValid.value) {
                if (this.fromValid.value >= this.toValid.value) {
                    return {notValidDatesRange: true};
                }

                setTimeout( () => {
                    if (this.fromValid.hasError('notValidDatesRange')) {
                        this.fromValid.setValue(this.fromValid.value);
                    }
                }, 1);
            }
        }

        return null;
    }]);

    validStates: ValueDataPair[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<UserAddEditDialogComponent>,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.originalUser = Object.assign({}, this.data.user);
        this.user = this.data.user;
        this.title = this.data.title;
        this.bEdit = this.data.bEdit;

        if (this.bEdit) {
            this.authenticationService.getLoggedUser().then(user => {
                this.loggedInUser = user;
            });

            this.oldUserName = this.user.username;

            this.name.setValue(this.user.name);
            this.surname.setValue(this.user.surname);
            this.username.setValue(this.user.username);
            this.email.setValue(this.user.email);
            this.fromValid.setValue(this.user.validFrom);
            this.toValid.setValue(this.user.validTo);
        }

        this.validStates = [];

        if (this.bEdit && this.isStateReadOnly()) {
            let accountState = new ValueDataPair();
            accountState.data = AccountState.PENDING_PASSWORD;
            this.validStates.push(accountState);

            accountState = new ValueDataPair();
            accountState.data = AccountState.PENDING_ACTIVATION;
            this.validStates.push(accountState);
        }
        else {
            let accountState = new ValueDataPair();
            accountState.data = AccountState.ACTIVE;
            this.validStates.push(accountState);

            accountState = new ValueDataPair();
            accountState.data = AccountState.LOCKED;
            this.validStates.push(accountState);

            accountState = new ValueDataPair();
            accountState.data = AccountState.DISABLED;
            this.validStates.push(accountState);
        }

        for (const pair of this.validStates) {
            pair.value = this.translateService.instant('COMMON.ENUM.ACCOUNT_STATE.' + pair.data.toString().toUpperCase());
        }
    }

    save(): void {
        this.user.name = this.name.value;
        this.user.surname = this.surname.value;
        this.user.email = this.email.value;
        this.user.username = this.username.value;
        this.user.validTo = this.toValid.value;
        this.user.validFrom = this.fromValid.value;

        if (this.bEdit) {
            this.userService.edit(this.originalUser, this.user, this.oldUserName).then(() => {
                this.dialogRef.close(this.user);
                if (this.user.id === this.loggedInUser.id &&
                    this.user.username !== this.loggedInUser.username) {
                    this.authenticationService.logout();
                }
            }).catch(error => this.errorHandling(error));
        } else {
            this.userService.add(this.user).then(() => {
                this.dialogRef.close(this.user);
            }).catch(error => this.errorHandling(error));
        }
    }

    errorHandling(error: ApiError): void {
        if (error.code === ApiErrorCode.USER_NOT_FOUND) {   // NOT_FOUND
            // CANCEL DIALOG AS EDIT IS NOT POSSIBLE AS ITEM WAS DELETED
            this.dialogRef.close(null);
        } else if (error.code === ApiErrorCode.DUPLICATE_USERNAME) {
            this.username.setErrors({notUnique: true});
        } else if (error.code === ApiErrorCode.DUPLICATE_EMAIL) {
            this.email.setErrors({notUnique: true});
        } else {
            console.log(error);
        }
    }

    dismiss(): void {
        this.dialogRef.close(null);
    }

    isMyOwnUser(): boolean {
        return this.loggedInUser && this.loggedInUser.id === this.user.id;
    }

    isStateReadOnly(): boolean {
        return this.user.accountState === AccountState.PENDING_ACTIVATION ||
            this.user.accountState === AccountState.PENDING_PASSWORD;
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (formControl.value && formControl.hasError('pattern')) {
            return this.translateService.instant('COMMON.VALIDATION.NOT_AN_EMAIL');
        } else if (formControl.hasError('notValidDatesRange')) {
            return this.translateService.instant('COMMON.VALIDATION.DATE_RANGE');
        } else if (formControl.hasError('notUnique')) {
            return this.translateService.instant('COMMON.VALIDATION.NOT_UNIQUE');
        } else {
            return '';
        }
    }

    isValid(): boolean {
        return (!this.bEdit || this.user.accountState) &&
            !this.name.hasError('required') &&
            !this.surname.hasError('required') &&
            !this.username.hasError('required') &&
            !this.username.hasError('notUnique') &&
            !this.email.hasError('pattern') &&
            !this.email.hasError('notUnique') &&
            !this.fromValid.hasError('required') &&
            !this.toValid.hasError('required');
    }

}
