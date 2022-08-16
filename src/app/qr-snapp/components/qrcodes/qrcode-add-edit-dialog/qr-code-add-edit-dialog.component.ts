import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupQRCodesService} from '../../../services/group-qrcodes.service';
import {ApiError, ApiErrorCode} from '../../../models/apiError';
import {TranslateService} from '@ngx-translate/core';
import {QrCode} from '../../../models/backend/qrCode';
import {ValueDataPair} from '../../../models/ui/valueDataPair';

@Component({
    selector: 'app-qrcode-add-edit-dialog',
    templateUrl: './qr-code-add-edit-dialog.component.html',
    styleUrls: ['./qr-code-add-edit-dialog.component.css']
})
export class QrCodeAddEditDialogComponent implements OnInit {

    reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    title: string;
    bEdit: string;
    qrCode: QrCode;
    friendlyName = new FormControl('', [Validators.required]);
    defaultRedirect = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
    selectedZoneId: string;
    startZoneId: string;
    validZoneIds: ValueDataPair[];
    isEnabled: boolean;
    maxScans = new FormControl();

    ngOnInit(): void {
        if (this.bEdit) {
            this.friendlyName.setValue(this.qrCode.friendlyName);
            this.defaultRedirect.setValue(this.qrCode.defaultRedirect);
            this.isEnabled = this.qrCode.enabled;
            this.startZoneId = this.qrCode.zoneId;
            this.maxScans.setValue(this.qrCode.maxBillingCycleScans);
        }
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<QrCodeAddEditDialogComponent>,
                private qrCodeService: GroupQRCodesService,
                private translateService: TranslateService) {
        this.bEdit = this.data.bEdit;

        this.qrCodeService.getZoneIds().then(zoneIds => {
            this.validZoneIds = [];
            zoneIds.forEach(zoneId => {
                this.validZoneIds.push({value: zoneId, data: zoneId});
            });
        });

        if (this.bEdit) {
            this.qrCode = this.data.qrcode;
        } else {
            this.qrCode = new QrCode();
        }

        this.title = this.data.title;
    }

    dismiss(): void {
        this.dialogRef.close(null);
    }

    save(): void {
        const newQrCode = Object.assign({} , this.qrCode);

        newQrCode.friendlyName = this.friendlyName.value;
        newQrCode.defaultRedirect = this.defaultRedirect.value;
        newQrCode.zoneId = this.selectedZoneId;
        newQrCode.enabled = this.isEnabled;
        newQrCode.maxBillingCycleScans = this.maxScans.value;

        if (this.bEdit) {
            this.qrCodeService.edit(this.qrCode, newQrCode, this.qrCode.id).then(() => {
                this.dialogRef.close(newQrCode);
            }).catch(error => this.errorHandling(error));
        } else {
            this.qrCodeService.add(newQrCode).then(() => {
                this.dialogRef.close(newQrCode);
            }).catch(error => this.errorHandling(error));
        }
    }

    errorHandling(error: ApiError): void {
        if (error.code === ApiErrorCode.USER_NOT_FOUND || error.code === ApiErrorCode.NOT_FOUND) {   // NOT_FOUND
            // CANCEL DIALOG AS EDIT IS NOT POSSIBLE AS ITEM WAS DELETED
            this.dialogRef.close(null);
        } else {
            console.log(error);
        }
    }

    isValid(): boolean {
        return !this.friendlyName.hasError('required') &&
            !this.defaultRedirect.hasError('required') &&
            this.selectedZoneId !== null && this.selectedZoneId !== '';
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else {
            return '';
        }
    }
}
