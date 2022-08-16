import {Injectable} from '@angular/core';
import {BaseDataStoreService} from './base-data-store.service';
import {AuthenticationService} from '../../services/authentication.service';
import {NotificationsService} from './notifications.service';
import {ApiError} from '../models/apiError';
import {SystemNotification} from '../models/ui/notification';
import {QrCodeRule} from '../models/backend/qrCodeRule';

@Injectable({
    providedIn: 'root'
})
export class QrcodeRuleService extends BaseDataStoreService<QrCodeRule> {

    qrCodeId: string;

    constructor(protected authenticationService: AuthenticationService,
                protected notificationsService: NotificationsService) {
        super(authenticationService, notificationsService);
    }

    protected addApiUrl(qrCodeRule: QrCodeRule): string {
        return '/profile/groups/qrcodes/' + this.qrCodeId + '/rules/';
    }

    addFailNotification(qrCodeRule: QrCodeRule, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCode_Rule_Add_Failed';
        notification.metadata = {name: qrCodeRule.friendlyName};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    addSuccessNotification(qrCodeRule: QrCodeRule): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCode_Rule_Added';
        notification.metadata = {name: qrCodeRule.friendlyName};
        return notification;
    }

    protected deleteApiUrl(qrCodeRule: QrCodeRule): string {
        return '/profile/groups/qrcodes/rules/' + qrCodeRule.id;
    }

    deleteFailNotification(qrCodeRule: QrCodeRule, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCODE_RULE_DELETE_FAIL';
        notification.metadata = {name: qrCodeRule.friendlyName};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    deleteSuccessNotification(qrCodeRule: QrCodeRule): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCODE_RULE_DELETED';
        notification.metadata = {name: qrCodeRule.friendlyName};
        return notification;
    }

    editFailNotification(qrCodeRule: QrCodeRule, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'EDIT_QRCODE_RULE_FAILED';
        notification.metadata = {name: qrCodeRule.friendlyName};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    editSuccessNotification(oldQRCodeRule: QrCodeRule, newQRCodeRule: QrCodeRule): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCode_Rule_Updated';
        notification.metadata = {name: oldQRCodeRule.friendlyName};
        return notification;
    }

    protected getAllApiUrl(): string {
        return '/profile/groups/qrcodes/' + this.qrCodeId + '/rules';
    }

    protected getOneApiUrl(id: any): string {
        return '/profile/groups/qrcodes/rules/' + id;
    }

    isSameId(rhs: QrCodeRule, lhs: QrCodeRule): boolean {
        return rhs.id === lhs.id;
    }

    protected postGetDataProcessing(qrCodeRule: QrCodeRule): void {
        if (qrCodeRule.validFromDate) {
            qrCodeRule.validFromDate = new Date(qrCodeRule.validFromDate);
        }

        if (qrCodeRule.validToDate) {
            qrCodeRule.validToDate = new Date(qrCodeRule.validToDate);
        }
    }

    protected updateApiUrl(qrCodeRule: QrCodeRule): string {
        return '/profile/groups/qrcodes/rules/' + qrCodeRule.id;
    }
}
