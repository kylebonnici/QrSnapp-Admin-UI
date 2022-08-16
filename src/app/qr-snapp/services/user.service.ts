import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {AuthenticationService} from '../../services/authentication.service';
import {BaseDataStoreService} from './base-data-store.service';
import {SystemNotification} from '../models/ui/notification';
import {NotificationsService} from './notifications.service';
import {ApiError, ApiErrorCode} from '../models/apiError';

@Injectable()
export class UserService extends BaseDataStoreService<User> {
    constructor(protected authenticationService: AuthenticationService,
                protected notificationsService: NotificationsService) {
        super(authenticationService, notificationsService);
    }

    private baseAPIUrl = '/users/';

    isSameId(rhs: User, lhs: User): boolean {
        return rhs.id === lhs.id;
    }

    getAllApiUrl(): string {
        return this.baseAPIUrl;
    }

    getOneApiUrl(username: string): string {
        return this.baseAPIUrl + username;
    }

    addApiUrl(): string {
        return this.baseAPIUrl;
    }

    deleteApiUrl(user: User): string {
        return this.baseAPIUrl + user.username;
    }

    updateApiUrl(user: User): string {
        return this.baseAPIUrl + user.username;
    }

    postGetDataProcessing(user: User): void {
        if (user.validTo) {
            user.validTo = new Date(user.validTo);
        }

        if (user.validFrom) {
            user.validFrom = new Date(user.validFrom);
        }
    }

    protected changeUserPasswordUrl(user: User, currentPassword: string, newPassword: string): string {
        return this.baseAPIUrl + encodeURIComponent(user.username) +
            'changePassword?currentPassword=' + encodeURIComponent(currentPassword) + '&newPassword=' + encodeURIComponent(newPassword);
    }

    protected requestFirstPasswordTokenUrl(user: User): string {
        return this.baseAPIUrl + encodeURIComponent(user.username) + '/requestFirstPasswordToken';
    }

    protected requestActivationTokenUrl(user: User): string {
        return '/sendActivationToken?username=' + encodeURIComponent(user.username);
    }

    protected changeOwnPasswordUrl(currentPassword: string, newPassword: string): string {
        return '/user/changePassword' +
            '?currentPassword=' + encodeURIComponent(currentPassword) + '&newPassword=' + encodeURIComponent(newPassword);
    }

    addSuccessNotification(user: User): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'User_Added';
        notification.metadata = {username: user.username};
        return notification;
    }

    editSuccessNotification(oldUser: User, newUser: User): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'User_Updated';
        notification.metadata = {username: newUser.username};
        return notification;
    }

    deleteSuccessNotification(user: User): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'User_Deleted';
        notification.metadata = {username: user.username};
        return notification;
    }

    addFailNotification(user: User, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Add_User_Failed';
        notification.apiError = apiError.code;
        notification.possibleErrors = [ApiErrorCode.DUPLICATE_EMAIL, ApiErrorCode.DUPLICATE_USERNAME];
        notification.metadata = {username: user.username};
        notification.error = true;
        return notification;
    }

    editFailNotification(user: User, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Edit_User_Failed';
        notification.apiError = apiError.code;
        notification.possibleErrors = [ApiErrorCode.USER_NOT_FOUND, ApiErrorCode.DUPLICATE_EMAIL, ApiErrorCode.DUPLICATE_USERNAME];
        notification.metadata = {username: user.username};
        notification.error = true;
        return notification;
    }

    deleteFailNotification(user: User, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Delete_User_Failed';
        notification.apiError = apiError.code;
        notification.possibleErrors = [ApiErrorCode.USER_NOT_FOUND, ApiErrorCode.DELETE_OWN_USER];
        notification.metadata = {username: user.username};
        notification.error = true;
        return notification;
    }

    sendActivationEmail(user: User): Promise<void> {
        return new Promise<void>(((resolve, rejects) => {
                this.authenticationService.put<void>(this.requestActivationTokenUrl(user), null,
                    () => {
                        const notification = new SystemNotification();
                        notification.code = 'Activation_Email_Sent';
                        notification.metadata = {email: user.email};
                        this.notificationsService.registerNotification(notification);

                        resolve(null);
                    }, error => {
                        const notification = new SystemNotification();
                        notification.code = 'Failed_Send_Activation_Email';
                        notification.metadata = {email: user.email};
                        this.notificationsService.registerNotification(notification);
                        rejects(error);
                    });
            })
        );
    }

    sendFirstPasswordEmail(user: User): Promise<void> {
        return new Promise<void>(((resolve, rejects) => {
                this.authenticationService.put<void>(this.requestFirstPasswordTokenUrl(user), null,
                    () => {
                        const notification = new SystemNotification();
                        notification.code = 'Activation_Email_Sent';
                        notification.metadata = {email: user.email};
                        this.notificationsService.registerNotification(notification);

                        resolve(null);
                    }, error => {
                        const notification = new SystemNotification();
                        notification.code = 'Failed_send_Activation_Email';
                        notification.metadata = {email: user.email};
                        notification.error = true;
                        this.notificationsService.registerNotification(notification);

                        rejects(error);
                    });
            })
        );
    }

    changeAccountPassword(currentPassword: string, newPassword: string): Promise<void> {
        return new Promise<void>(((resolve, rejects) => {
                this.authenticationService.put<void>(this.changeOwnPasswordUrl(currentPassword, newPassword), null,
                    () => {
                        const notification = new SystemNotification();
                        notification.code = 'Account_Password_changed';
                        this.notificationsService.registerNotification(notification);

                        resolve(null);
                    }, error => {
                        const notification = new SystemNotification();
                        notification.code = 'Account_Password_change_failed';
                        notification.apiError = error.code;
                        notification.error = true;
                        notification.possibleErrors = [ApiErrorCode.PASSWORD_NOT_SECURE, ApiErrorCode.INVALID_PASSWORD];
                        this.notificationsService.registerNotification(notification);

                        rejects(error);
                    });
            })
        );
    }

    changeUserPassword(user: User, currentPassword: string, newPassword: string): Promise<void> {
        return new Promise<void>(((resolve, rejects) => {
                this.authenticationService.put<void>(this.changeUserPasswordUrl(user, currentPassword, newPassword), null,
                    () => {
                        const notification = new SystemNotification();
                        notification.code = 'Password_changed';
                        notification.metadata = {username: user.username};
                        this.notificationsService.registerNotification(notification);

                        resolve(null);
                    }, error => {
                        const notification = new SystemNotification();
                        notification.code = 'Password_change_failed';
                        notification.apiError = error.code;
                        notification.error = true;
                        notification.metadata = {username: user.username};
                        notification.possibleErrors = [ApiErrorCode.PASSWORD_NOT_SECURE, ApiErrorCode.INVALID_PASSWORD];
                        this.notificationsService.registerNotification(notification);
                        rejects(error);
                    });
            })
        );
    }
}
