import {Injectable} from '@angular/core';
import {Role} from '../models/role';
import {AuthenticationService} from '../../services/authentication.service';
import {BaseDataStoreService} from './base-data-store.service';
import {ApiError, ApiErrorCode} from '../models/apiError';
import {SystemNotification} from '../models/ui/notification';
import {NotificationsService} from './notifications.service';
import {User} from '../models/user';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class RoleService extends BaseDataStoreService<Role> {
    private baseAPIUrl = '/users/';

    myRoles: Role[];
    allSystemRolesBehaviorSubject: BehaviorSubject<Role[]>;
    user: User;

    getRoles = '/roles';
    getMyRoles = '/user/roles';

    constructor(protected authenticationService: AuthenticationService,
                protected notificationsService: NotificationsService) {
        super(authenticationService, notificationsService);

        this.myRoles = [];
        this.allSystemRolesBehaviorSubject = new BehaviorSubject<Role[]>([]);
        this.user = new User();

        this.loadAllSystemRoles();
    }

    addSuccessNotification(role: Role): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Role_Added';
        notification.metadata = {username: this.user.username};
        notification.translatableMetadata = {role: 'COMMON.ROLE.' + role.name.toUpperCase()};
        return notification;
    }

    editSuccessNotification(oldRole: Role, newRole: Role): SystemNotification {
        throw new Error('Method not implemented.');
    }

    deleteSuccessNotification(role: Role): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Role_Deleted';
        notification.metadata = {username: this.user.username};
        notification.translatableMetadata = {role: 'COMMON.ROLE.' + role.name.toUpperCase()};
        return notification;
    }

    addFailNotification(role: Role, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Role_Add_fail';
        notification.error = true;
        notification.possibleErrors = [ApiErrorCode.CHANGE_OWN_ROLES];
        notification.metadata = {username: this.user.username};
        notification.translatableMetadata = {role: 'COMMON.ROLE.' + role.name.toUpperCase()};
        return notification;
    }

    editFailNotification(role: Role, apiError: ApiError): SystemNotification {
        throw new Error('Method not implemented.');
    }

    deleteFailNotification(role: Role, apiError: ApiError): SystemNotification {
        const notification = new SystemNotification();
        notification.code = 'Role_Delete_fail';
        notification.error = true;
        notification.possibleErrors = [ApiErrorCode.CHANGE_OWN_ROLES];
        notification.metadata = {username: this.user.username};
        notification.translatableMetadata = {role: 'COMMON.ROLE.' + role.name.toUpperCase()};
        return notification;
    }

    isSameId(rhs: Role, lhs: Role): boolean {
        return rhs.id === lhs.id;
    }

    protected getAllApiUrl(): string {
        return this.baseAPIUrl + this.user.username + '/roles';
    }

    protected getOneApiUrl(id: any): string {
        throw new Error('Method not implemented.');
    }

    protected addApiUrl(role: Role): string {
        return this.baseAPIUrl + this.user.username + '/roles/' + role.id;
    }

    protected deleteApiUrl(role: Role): string {
        return this.baseAPIUrl + this.user.username + '/roles/' + role.id;
    }

    protected getUserRolesUrl(user: User): string {
        return this.baseAPIUrl + user.username + '/roles';
    }


    protected updateApiUrl(role: Role): string {
        throw new Error('Method not implemented.');
    }

    protected postGetDataProcessing(data: Role): void {
        // noting to process
    }


    hasRole(role: string): boolean {
        for (const myRole of this.myRoles) {
            if (myRole.name === role) {
                return true;
            }
        }

        return false;
    }

    hasRoles(roles: string[]): boolean {
        for (const role of roles) {
            if (!this.hasRole(role)) {
                return false;
            }
        }

        return true;
    }

    loadSessionRoles(): void {
        this.authenticationService.get<Role[]>(this.getMyRoles,
            roles => {
                this.myRoles = roles;
            }, error => {
                if (this.authenticationService.authenticated) {
                    this.loadSessionRoles();
                }
                console.log(error);
            });
    }

    getUserRoles(user: User): Promise<Role[]> {
        return new Promise<Role[]>(((resolve, reject) => {
                this.authenticationService.get<Role[]>(this.getUserRolesUrl(user),
                    roles => {
                        resolve(roles);
                    }, error => {
                        reject(error);
                    });
            })
        );
    }

    loadAllSystemRoles(): void {
        this.authenticationService.get<Role[]>(this.getRoles,
            roles => {
                this.allSystemRolesBehaviorSubject.next(roles);
            }, error => {
                this.allSystemRolesBehaviorSubject.next([]);
                if (this.authenticationService.authenticated) {
                    this.loadAllSystemRoles();
                }
                console.log(error);
            });
    }
}
