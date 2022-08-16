import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-string-input-dialog',
    templateUrl: './string-input-dialog.component.html',
    styleUrls: ['./string-input-dialog.component.css']
})
export class StringInputDialogComponent implements OnInit {
    valueFormControl: FormControl;
    title: string;
    placeholder: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<StringInputDialogComponent>,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        const validators: ValidatorFn[] = [Validators.required];

        this.title = this.data.title;
        this.placeholder = this.data.placeholder;

        if (this.data.value !== undefined) {
            this.valueFormControl = new FormControl(this.data.value, validators);
        } else {
            this.valueFormControl = new FormControl('', validators);
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
        } else {
            return '';
        }
    }

    isValid(): boolean {
        return !this.valueFormControl.hasError('required');
    }
}
