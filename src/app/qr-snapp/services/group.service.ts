import {Injectable} from '@angular/core';
import {BaseDataStoreService} from './base-data-store.service';
import {Group} from '../models/backend/group';
import {ApiError, ApiErrorCode} from '../models/apiError';
import {SystemNotification} from '../models/ui/notification';
import {AuthenticationService} from '../../services/authentication.service';
import {NotificationsService} from './notifications.service';

@Injectable({
    providedIn: 'root'
})
export class GroupService extends BaseDataStoreService<Group> {

    constructor(protected authenticationService: AuthenticationService,
                protected notificationsService: NotificationsService) {
        super(authenticationService, notificationsService);
        this.getAll();
    }

    protected addApiUrl(group: Group): string {
        return '/profile/' + this.authenticationService.getCurrentProfile() + '/groups/';
    }

    addFailNotification(group: Group, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Add_Group_Failed';
        notification.metadata = {name: group.name};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    addSuccessNotification(group: Group): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Group_Added';
        notification.metadata = {name: group.name};
        return notification;
    }

    protected deleteApiUrl(group: Group): string {
        return '/profile/groups/' + group.id;
    }

    deleteFailNotification(group: Group, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Delete_Group_Failed';
        notification.possibleErrors = [ApiErrorCode.NOT_FOUND];
        notification.metadata = {name: group.name};
        notification.apiError = apiError.code;
        notification.error = true;
        return notification;
    }

    deleteSuccessNotification(group: Group): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Group_Deleted';
        notification.metadata = {name: group.name};
        return notification;
    }

    editFailNotification(group: Group, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Edit_Group_Failed';
        notification.apiError = apiError.code;
        notification.metadata = {name: group.name};
        notification.possibleErrors = [ApiErrorCode.NOT_FOUND];
        notification.error = true;
        return notification;
    }

    editSuccessNotification(oldGroup: Group, newGroup: Group): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Group_Updated';
        notification.metadata = {name: oldGroup.name};
        return notification;
    }

    protected getAllApiUrl(): string {
        return '/profile/' + this.authenticationService.getCurrentProfile() + '/groups/';
    }

    protected getOneApiUrl(id: any): string {
        return '/profile/groups/' + id;
    }

    isSameId(rhs: Group, lhs: Group): boolean {
        return rhs.id === lhs.id;
    }

    protected postGetDataProcessing(data: Group): void {
        // do nothing
    }

    protected updateApiUrl(group: Group): string {
        return '/profile/groups/' + group.id;
    }
}
