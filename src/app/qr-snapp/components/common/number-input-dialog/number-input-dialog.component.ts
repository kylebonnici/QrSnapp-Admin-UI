import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ValidatorsService} from '../../../../services/validators.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-number-input-dialog',
    templateUrl: './number-input-dialog.component.html',
    styleUrls: ['./number-input-dialog.component.scss']
})
export class NumberInputDialogComponent implements OnInit {
    valueFormControl: FormControl;
    title: string;
    placeholder: string;
    min: number;
    max: number;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private validatorsService: ValidatorsService,
                private dialogRef: MatDialogRef<NumberInputDialogComponent>,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        const validators: ValidatorFn[] = [Validators.required];

        this.title = this.data.title;
        this.placeholder = this.data.placeholder;

        if (this.data.min !== undefined) {
            this.min = this.data.min;
            validators.push(Validators.min(this.min));
        }

        if (this.data.max !== undefined) {
            this.max = this.data.max;
            validators.push(Validators.max(this.max));
        }

        if (this.data.integer !== undefined && this.data.integer) {
            validators.push(this.validatorsService.isInteger);
        }

        this.valueFormControl = new FormControl('', validators);

        if (this.data.value !== undefined) {
            this.valueFormControl.setValue(this.data.value);
        }
    }

    ok(): void {
        this.dialogRef.close(this.valueFormControl.value);
    }

    cancel(): void {
        this.dialogRef.close(null);
    }

    getErrorMessage(): string {
        if (this.valueFormControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (this.valueFormControl.hasError('notNumeric')) {
            return this.translateService.instant('COMMON.VALIDATION.INTEGER_NUMBER_ONLY');
        } else if (this.valueFormControl.hasError('min')) {
            return this.translateService.instant('COMMON.VALIDATION.GREATER_EQUAL_TO', {value: this.min});
        } else if (this.valueFormControl.hasError('max')) {
            return this.translateService.instant('COMMON.VALIDATION.LESS_EQUAL_TO', {value: this.min});
        } else {
            return '';
        }
    }

    isValid(): boolean {
        return !this.valueFormControl.hasError('min') &&
            !this.valueFormControl.hasError('max') &&
            !this.valueFormControl.hasError('notNumeric') &&
            !this.valueFormControl.hasError('required');
    }
}
