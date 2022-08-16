import {Component, OnInit} from '@angular/core';
import {StripeSubscriptionsService} from '../../../services/stripe-subscriptions.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../common/delete-confirm-dialog/delete-confirm-dialog.component';
import {QrCodeSubscriptionUsage} from '../../../models/backend/qrCodeSubscriptionUsage';
import {ActivatedRoute, Params} from '@angular/router';
import {loadStripe} from '@stripe/stripe-js';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

    constructor(public stripeSubscriptionsService: StripeSubscriptionsService,
                private activatedRoute: ActivatedRoute,
                private authenticationService: AuthenticationService,
                protected dialog: MatDialog) {
    }

    pageTranslationID = 'SUBSCRIPTIONS';

    ngOnInit(): void {
        this.stripeSubscriptionsService.hasQrCodeSubscription().then(has => {
            if (!has) {
                loadStripe(this.stripeSubscriptionsService.publishableKey).then(stripe => {
                    this.activatedRoute.queryParams.subscribe((params: Params) => {
                        if (params.qrCodeSubscription) {
                            this.stripeSubscriptionsService
                                .addQrCodeSubscription(params.qrCodeUsagePriceId,
                                    params.uniqueQrCodePriceId).then(sessionId => {
                                stripe.redirectToCheckout({
                                    sessionId
                                });
                            });
                        }
                    });
                });
            }
        });
    }

    cancelQrCodeSubscription(): void {
        const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
            data: this.pageTranslationID + '.LABEL.CANCEL_SUBSCRIPTION'
        });

        const subscription = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.stripeSubscriptionsService.cancelProfileQrCodeSubscription();
            }

            subscription.unsubscribe();
        });
    }

    getQrCodeUsage(): QrCodeSubscriptionUsage {
        return this.stripeSubscriptionsService.qrCodeUsage;
    }
}
