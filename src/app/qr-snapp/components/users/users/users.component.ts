import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {RoleService} from '../../../services/role.service';
import {AccountState, User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {UserAddEditDialogComponent} from '../user-add-edit-dialog/user-add-edit-dialog.component';
import {ChangeUserPasswordDialogComponent} from '../change-user-password-dialog/change-user-password-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {BaseDataControllerComponent} from '../../common/base-data-controller/base-data-controller.component';
import {AuthenticationService} from '../../../../services/authentication.service';
import {FilterType} from '../../../models/ui/filterType';
import {TableColumnDefinition} from '../../../models/ui/tableColumnDefinition';
import {TableActions} from '../../../models/ui/tableActions';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseDataControllerComponent<User> {

    constructor(protected dialog: MatDialog,
                public userService: UserService,
                private authenticationService: AuthenticationService,
                private router: Router,
                public roleService: RoleService,
                protected translateService: TranslateService ) {
        super(userService, dialog, translateService);
        this.hasSelection = true;
        this.hasActions = true;

        this.authenticationService.getLoggedUser().then(user => {
            this.loggedInUser = user;
        });

        this.prepareFilters();
        this.prepareTableColumnDefinitions();
        this.prepareTableRowActions();
        this.loadAllOnLoad = true;
    }

    loggedInUser: User;
    pageTranslationID = 'USERS.';

    private prepareTableColumnDefinitions(): void {
        const nameTableColumnDefinition = new TableColumnDefinition();
        nameTableColumnDefinition.code = 'full_name';
        nameTableColumnDefinition.getData = (user: User): string => user.name + ' ' + user.surname;

        const usernameTableColumnDefinition = new TableColumnDefinition();
        usernameTableColumnDefinition.code = 'username';
        usernameTableColumnDefinition.getData = (user: User): string => user.username;

        const emailTableColumnDefinition = new TableColumnDefinition();
        emailTableColumnDefinition.code = 'email';
        emailTableColumnDefinition.getData = (user: User): string => user.email;

        const accountStateTableColumnDefinition = new TableColumnDefinition();
        accountStateTableColumnDefinition.code = 'account_State';
        accountStateTableColumnDefinition.getData = (user: User): string => {
            return this.translateService.instant('COMMON.ENUM.ACCOUNT_STATE.' + user.accountState.toUpperCase());
        };

        this.tableColumnDefinitions.push(nameTableColumnDefinition);
        this.tableColumnDefinitions.push(usernameTableColumnDefinition);
        this.tableColumnDefinitions.push(emailTableColumnDefinition);
        this.tableColumnDefinitions.push(accountStateTableColumnDefinition);
    }

    private prepareFilters(): void {
        const fullNameFilter = new FilterType<User>();
        fullNameFilter.code = 'Name';
        fullNameFilter.predicate = (user: User, f): boolean => {
            return user.name.startsWith(f);
        };

        const fullSurnameFilter = new FilterType<User>();
        fullSurnameFilter.code = 'Surname';
        fullSurnameFilter.predicate = (user: User, f): boolean => {
            return user.surname.startsWith(f);
        };

        const fullEmailFilter = new FilterType<User>();
        fullEmailFilter.code = 'Email';
        fullEmailFilter.predicate = (user: User, f): boolean => {
            return user.email.startsWith(f);
        };

        const fullAccountStateFilter = new FilterType<User>();
        fullAccountStateFilter.code = 'Account_State';

        fullAccountStateFilter.possibleValues = [];
        for (const accountState in AccountState){
            if (accountState) {
                fullAccountStateFilter.possibleValues.push(this.translateService.instant('COMMON.ENUM.ACCOUNT_STATE.' + accountState));
            }
        }

        fullAccountStateFilter.predicate = (user: User, f): boolean => {
            return this.translateService.instant('COMMON.ENUM.ACCOUNT_STATE.' + user.accountState.toUpperCase()) === f;
        };

        this.filterTypes.push(fullNameFilter);
        this.filterTypes.push(fullSurnameFilter);
        this.filterTypes.push(fullEmailFilter);
        this.filterTypes.push(fullAccountStateFilter);
    }

    private prepareTableRowActions(): void {
        const editTableAction = new TableActions<User>();
        editTableAction.matIcon = 'edit';
        editTableAction.action = (user: User) => this.edit(user);
        editTableAction.isDisabled = () => !this.roleService.hasRole('ROLE_MANAGE_USERS');
        editTableAction.isVisible = () => true;
        editTableAction.tooltip = () => this.translateService.instant('COMMON.TOOLTIP.EDIT');
        editTableAction.color = () => 'primary';

        const manageUserRolesTableAction = new TableActions<User>();
        manageUserRolesTableAction.matIcon = 'admin_panel_settings';
        manageUserRolesTableAction.action = (user: User) => this.details(user);
        manageUserRolesTableAction.isDisabled = () => !this.roleService.hasRole('ROLE_MANAGE_USERS');
        manageUserRolesTableAction.isVisible = () => true;
        manageUserRolesTableAction.tooltip = () =>  this.translateService.instant('COMMON.TOOLTIP.MANAGE_USER_ROLES');
        manageUserRolesTableAction.color = () => 'primary';

        const changePasswordTableAction = new TableActions<User>();
        changePasswordTableAction.matIcon = 'security';
        changePasswordTableAction.action = (user: User) => {
            if (!this.isPendingActivation(user) && !this.isPendingPassword(user)) {
                this.changePassword(user);
            } else if (this.isPendingActivation(user)) {
                this.sendActivationEmail(user);
            } else if (this.isPendingPassword(user)) {
                this.sendPasswordEmail(user);
            }
        };
        changePasswordTableAction.isDisabled = () => !this.roleService.hasRole('ROLE_MANAGE_USERS');
        changePasswordTableAction.isVisible = () => true;
        changePasswordTableAction.tooltip = (user: User) => {
            if (!this.isPendingActivation(user) && !this.isPendingPassword(user)) {
                return this.translateService.instant('COMMON.TOOLTIP.CHANGE_PASSWORD');
            } else if (this.isPendingActivation(user)) {
                return this.translateService.instant('COMMON.TOOLTIP.SEND_ACTIVATION_EMAIL');
            } else if (this.isPendingPassword(user)) {
                return this.translateService.instant('COMMON.SEND_SET_FIRST_PASSWORD_EMAIL');
            }
        };
        changePasswordTableAction.color = (user: User) => this.isPendingActivation(user) || this.isPendingPassword(user) ? 'warn' : 'primary';

        this.tableActions.push(editTableAction);
        this.tableActions.push(manageUserRolesTableAction);
        this.tableActions.push(changePasswordTableAction);
    }

    changePassword(user: User): void {
        this.dialog.open(ChangeUserPasswordDialogComponent, {
            data: {
                user
            }
        });
    }

    add(): void {
        this.dialog.open(UserAddEditDialogComponent, {
            data: {
                user: new User(),
                title: 'USERS.LABEL.NEW_USER',
                bEdit: false
            }
        });
    }

    edit(user: User): void {
        this.dialog.open(UserAddEditDialogComponent, {
            data: {
                user: Object.assign({}, user),
                title: 'USERS.LABEL.EDIT_USER',
                bEdit: true
            }
        });
    }

    details(user: User): void {
        this.router.navigate(['/profile/' + this.authenticationService.getCurrentProfile() + '/users/', user.username + '/details']);
    }

    isPendingActivation(user: User): boolean {
        return user.accountState === AccountState.PENDING_ACTIVATION;
    }

    isPendingPassword(user: User): boolean {
        return user.accountState === AccountState.PENDING_PASSWORD;
    }

    sendActivationEmail(user: User): void {
        this.userService.sendActivationEmail(user);
    }

    sendPasswordEmail(user: User): void {
        this.userService.sendFirstPasswordEmail(user);
    }
}
