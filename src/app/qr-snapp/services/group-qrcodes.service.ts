import {Injectable} from '@angular/core';
import {BaseDataStoreService} from './base-data-store.service';
import {AuthenticationService} from '../../services/authentication.service';
import {NotificationsService} from './notifications.service';
import {ApiError} from '../models/apiError';
import {SystemNotification} from '../models/ui/notification';
import {QrCode} from '../models/backend/qrCode';
import {User} from '../models/user';
import {Role} from '../models/role';

@Injectable({
    providedIn: 'root'
})
export class GroupQRCodesService extends BaseDataStoreService<QrCode> {

    groupId: number;

    constructor(protected authenticationService: AuthenticationService,
                protected notificationsService: NotificationsService) {
        super(authenticationService, notificationsService);
    }

    protected addApiUrl(qrCode: QrCode): string {
        return '/profile/groups/' + this.groupId + '/qrcodes/';
    }

    addFailNotification(qrCode: QrCode, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCODE_ADD_FAIL';
        notification.metadata = {name: qrCode.friendlyName};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    addSuccessNotification(qrCode: QrCode): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCode_Added';
        notification.metadata = {name: qrCode.friendlyName};
        return notification;
    }

    protected deleteApiUrl(qrCode: QrCode): string {
        return '/profile/groups/qrcodes/' + qrCode.id;
    }

    deleteFailNotification(qrCode: QrCode, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCODE_DELETE_FAIL';
        notification.metadata = {name: qrCode.friendlyName};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    deleteSuccessNotification(qrCode: QrCode): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCode_Deleted';
        notification.metadata = {name: qrCode.friendlyName};
        return notification;
    }

    editFailNotification(qrCode: QrCode, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Edit_QRCode_Failed';
        notification.metadata = {name: qrCode.friendlyName};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    editSuccessNotification(oldQRCode: QrCode, newQRCode: QrCode): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'QRCode_Updated';
        notification.metadata = {name: oldQRCode.friendlyName};
        return notification;
    }

    protected getAllApiUrl(): string {
        return '/profile/groups/' + this.groupId + '/qrcodes';
    }

    protected getOneApiUrl(id: any): string {
        return '/profile/groups/qrcodes/' + id;
    }

    isSameId(rhs: QrCode, lhs: QrCode): boolean {
        return rhs.id === lhs.id;
    }

    protected postGetDataProcessing(qrCode: QrCode): void {
        // do nothing
    }

    protected updateApiUrl(qrCode: QrCode): string {
        return '/profile/groups/qrcodes/' + qrCode.id;
    }

    getZoneIds(): Promise<string[]> {
        return new Promise<string[]>(((resolve, reject) => {
                this.authenticationService.get<string[]>('/zoneids/',
                    zoneIds => {
                        resolve(zoneIds.sort((a, b) => a.localeCompare(b)));
                    }, error => {
                        reject(error);
                    });
            })
        );
    }
}
