import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {RoleService} from '../../services/role.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {NotificationsService} from '../../services/notifications.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {SystemNotification} from '../../models/ui/notification';
import {StripeSubscriptionsService} from '../../services/stripe-subscriptions.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    constructor(zone: NgZone,
                public authenticationService: AuthenticationService,
                public roleService: RoleService,
                private snackBar: MatSnackBar,
                public notificationsService: NotificationsService,
                private translateService: TranslateService,
                private router: Router,
                public stripeSubscriptionsService: StripeSubscriptionsService) {
        roleService.loadSessionRoles();
    }

    getNotificationMergedMetadata(notification: SystemNotification): object {
        return Object.assign({}, notification.metadata, this.getNotificationTranslatedMetadata(notification));
    }

    private getNotificationTranslatedMetadata(notification: SystemNotification): object {
        const obj = Object.assign({}, notification.translatableMetadata);

        for (const key of Object.keys(obj)) {
            obj[key] = this.translateService.instant(notification.translatableMetadata[key]);
        }

        return obj;
    }

    getNotificationErrorMessage(notification: SystemNotification): string {
        if (notification.error === false && notification.apiError === null) {
            return '';
        }
        if ((notification.apiError === null && notification.error === true) ||
            notification.possibleErrors.indexOf(notification.apiError) === -1) {
            return this.translateService.instant('NOTIFICATIONS.LABEL.UNKNOWN_API_ERROR.MESSAGE');
        }

        return this.translateService.instant('COMMON.ENUM.API_ERROR.' + notification.apiError.toString().toUpperCase() + '.MESSAGE');
    }

    ngOnInit() {
        this.notificationsService.observable.subscribe(notification => {
            if (notification && notification.snackbar) {
                this.snackBar.open(this.translateService.instant('NOTIFICATION.TYPE.' + notification.code.toUpperCase() + '.TITLE'), '', {
                    duration: notification.duration
                });
            }
        });
    }

    manageSubscription() {
        this.router.navigate(['/profile/' + this.authenticationService.getCurrentProfile() + '/subscriptions']);
    }
}
