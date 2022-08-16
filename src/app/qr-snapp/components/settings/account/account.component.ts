import {Component, OnInit} from '@angular/core';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {ChangeAccountPasswordDialogComponent} from '../change-account-password-dialog/change-account-password-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {StripeSubscriptionsService} from '../../../services/stripe-subscriptions.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    user = new User();
    queryInProgress: number;
    pageTranslationID = 'USER_ACCOUNT.';

    constructor(private dialog: MatDialog,
                private authenticationService: AuthenticationService,
                protected userService: UserService) {
      this.queryInProgress = 0;
    }

    ngOnInit() {
        this.reload();
    }

    reload(): void {
        this.queryInProgress ++;
        this.authenticationService.getLoggedUser().then(user => {
            this.queryInProgress --;
            this.user = user;
        }).catch( () => this.queryInProgress--);
    }

    changePassword(): void {
        this.dialog.open(ChangeAccountPasswordDialogComponent, {});
    }

    getProgressBarMode(): ProgressBarMode {
        return this.queryInProgress > 0 ? 'query' : 'determinate';
    }
}
