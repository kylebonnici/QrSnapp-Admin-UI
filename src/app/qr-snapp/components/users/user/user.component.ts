import {Component} from '@angular/core';
import {RoleService} from '../../../services/role.service';
import {ActivatedRoute, Router} from '@angular/router';
import { User} from '../../../models/user';
import {Role} from '../../../models/role';
import {UserService} from '../../../services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../services/authentication.service';
import {BaseDataControllerComponent} from '../../common/base-data-controller/base-data-controller.component';
import {TableColumnDefinition} from '../../../models/ui/tableColumnDefinition';
import {ApiError, ApiErrorCode} from '../../../models/apiError';
import {FilterType} from '../../../models/ui/filterType';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseDataControllerComponent<Role> {
    loggedInUser: User;
    user = new User();
    localAllUserRoles: Role[];
    silent = false;
    pageTranslationID = 'USER.';

    constructor(protected dialog: MatDialog,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private router: Router,
                private activateRouter: ActivatedRoute,
                public roleService: RoleService,
                protected translateService: TranslateService
    ) {
        super(roleService, dialog, translateService);

        this.hasSelection = true;
        this.localData = roleService.allSystemRolesBehaviorSubject.asObservable();

        this.authenticationService.getLoggedUser().then(user => {
            this.loggedInUser = user;
        });

        this.activateRouter.params.subscribe(params => {
            const username = params.username;
            this.userService.get(username).then(user => {
                this.roleService.user = user;
                this.roleService.getAll();

                this.roleService.getUserRoles(user).then(roles => {
                    for (const role of roles) {
                        const index = this.roleService.allSystemRolesBehaviorSubject.value.findIndex(r => r.id === role.id);
                        this.selection.select(this.roleService.allSystemRolesBehaviorSubject.value[index]);
                    }

                    this.selection.changed.asObservable().subscribe(selectionChange => {
                        if (!this.silent) {
                            for (const added of selectionChange.added) {
                                this.roleService.add(added).catch(() => {
                                    this.silent = true;
                                    this.selection.deselect(added);
                                    this.silent = false;
                                });
                            }

                            for (const removed of selectionChange.removed) {
                                this.roleService.delete(removed).catch(() => {
                                    this.silent = true;
                                    this.selection.select(removed);
                                    this.silent = false;
                                });
                            }
                        }
                    });
                });
            }, (error: ApiError) => {
                if (error.code === ApiErrorCode.USER_NOT_FOUND) {
                    this.redirectToUserManagementPage();
                }
            });
        });

        this.prepareTableColumnDefinitions();
        this.prepareFilters();
    }

    private prepareTableColumnDefinitions(): void {
        const roleTableColumnDefinition = new TableColumnDefinition();
        roleTableColumnDefinition.code = 'role';
        roleTableColumnDefinition.getData = (role: Role): string => this.translateService.instant('COMMON.ROLE.' + role.name.toUpperCase());

        this.tableColumnDefinitions.push(roleTableColumnDefinition);
    }

    private prepareFilters(): void {
        const roleNameFilter = new FilterType<Role>();
        roleNameFilter.code = 'Role_Name';
        roleNameFilter.possibleValues = [];
        for (const role of this.roleService.allSystemRolesBehaviorSubject.value) {
            roleNameFilter.possibleValues.push(this.translateService.instant('COMMON.ROLE.' + role.name.toUpperCase()));
        }

        roleNameFilter.predicate = (role: Role, f): boolean => {
            return this.translateService.instant('COMMON.ROLE.' + role.name.toUpperCase()) === f;
        };

        this.filterTypes.push(roleNameFilter);
    }

    userHasRole(role: Role): boolean {
        if (this.localAllUserRoles) {
            for (const r of this.localAllUserRoles) {
                if (r.id === role.id) {
                    return true;
                }
            }
        }
        return false;
    }

    redirectToUserManagementPage(): void {
        this.router.navigate(['/profile/' + this.authenticationService.getCurrentProfile() + '/users']);
    }
}


