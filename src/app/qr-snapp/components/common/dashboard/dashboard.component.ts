import {Component, OnInit} from '@angular/core';
import {DashboardItem} from '../../../models/ui/dashboardItem';
import {RoleService} from '../../../services/role.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    dashboardItems: DashboardItem[];
    pageTranslationID = 'DASHBOARD.';

    constructor(public roleService: RoleService,
                public authenticationService: AuthenticationService,
                public router: Router) {
        this.initDashboardItems();
    }

    ngOnInit(): void {
    }


    private initDashboardItems(): void {
        this.dashboardItems = [];

        const account = new DashboardItem();
        account.matIcon = 'account_box';
        account.code = 'MY_ACCOUNT';
        account.route = '/profile/' + this.authenticationService.getCurrentProfile() + '/settings/account';

        this.dashboardItems.push(account);

        const users = new DashboardItem();
        users.matIcon = 'person';
        users.code = 'USERS';
        users.route = '/profile/' + this.authenticationService.getCurrentProfile() + '/users';
        users.requiredRoles = ['ROLE_MANAGE_USERS'];

        this.dashboardItems.push(users);

        const groups = new DashboardItem();
        groups.matIcon = 'qr_code_2';
        groups.code = 'GROUPS';
        groups.route = '/profile/' + this.authenticationService.getCurrentProfile() + '/groups';

        this.dashboardItems.push(groups);

        const subscriptions = new DashboardItem();
        subscriptions.matIcon = 'card_membership';
        subscriptions.code = 'SUBSCRIPTIONS';
        subscriptions.route = '/profile/' + this.authenticationService.getCurrentProfile() + '/subscriptions';

        this.dashboardItems.push(subscriptions);
    }
}
