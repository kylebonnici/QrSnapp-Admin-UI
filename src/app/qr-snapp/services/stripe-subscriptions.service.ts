import {Injectable} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {QrCodeSubscriptionUsage} from '../models/backend/qrCodeSubscriptionUsage';
import {StripeSubscription} from '../models/backend/StripeSubscription';
import {IndividualQrCodeUsage} from '../models/backend/IndividualQrCodeUsage';

@Injectable({
    providedIn: 'root'
})
export class StripeSubscriptionsService {

    constructor(private authenticationService: AuthenticationService) {
        this.updateData();
    }

    publishableKey = 'pk_test_51IXnJrA4EZNldpMUnpnFZKwzeLU4XPw6IBJ3vnN3yQ0OC3gehVUr5baB0DfavVuqdyXyL6WzB2DGv3BPRGwY1FQa00NxXV3xEj';
    subscription = true;
    activeQrCodeSubscription = true;
    qrCodeUsage = new QrCodeSubscriptionUsage();
    stripeQrCodeSubscription = new StripeSubscription();

    updateData(): void {
        this.hasQrCodeSubscription().then(has => {
            this.subscription = has;
            this.activeQrCodeSubscription = has;
        });

        this.getProfileQrCodeSubscriptionUsage().then(usage => {
            this.qrCodeUsage = usage;
        });

        this.getQrCodeSubscription().then(stripeSubscription => {
            this.stripeQrCodeSubscription = stripeSubscription;
        });
    }

    hasQrCodeSubscription(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
                this.authenticationService.get<boolean>('/profile/' +
                    this.authenticationService.getCurrentProfile() + '/subscriptions/has/product/qrcode/',
                    data => {
                        resolve(data);
                    },
                    error => {
                        reject(error);
                    });
            }
        );
    }

    addQrCodeSubscription(qrCodeUsagePriceId: string, uniqueQrCodePriceId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.authenticationService.postAny<any>
            ('/profile/' + this.authenticationService.getCurrentProfile() +
                '/subscriptions/qrcode/', [qrCodeUsagePriceId, uniqueQrCodePriceId],
                data => {
                    resolve(data.sessionKey);
                },
                error => {
                    reject(error);
                });
        });
    }

    cancelProfileQrCodeSubscription(): Promise<void> {
        return this.cancelQrCodeSubscription()
            .then(() => this.updateData());
    }

    cancelQrCodeSubscription(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.authenticationService.delete
            ('/profile/' + this.authenticationService.getCurrentProfile() + '/subscriptions/qrcode',
                () => {
                    resolve(null);
                },
                error => {
                    reject(error);
                });
        });
    }

    getQrCodeSubscription(): Promise<StripeSubscription> {
        return new Promise<StripeSubscription>((resolve, reject) => {
            this.authenticationService.get<StripeSubscription>
            ('/profile/' + this.authenticationService.getCurrentProfile() + '/subscriptions/product/qrcode/',
                stripeSubscription => {
                    resolve(stripeSubscription);
                },
                error => {
                    reject(error);
                });
        });
    }

    getProfileQrCodeSubscriptionUsage(): Promise<QrCodeSubscriptionUsage> {
        return new Promise<QrCodeSubscriptionUsage>((resolve, reject) => {
            this.authenticationService.get<QrCodeSubscriptionUsage>
            ('/profile/' + this.authenticationService.getCurrentProfile() + '/subscriptions/qrcode/usage/',
                data => {
                    resolve(data);
                },
                error => {
                    reject(error);
                });
        });
    }

    getIndividualQrCodeSubscriptionUsage(qrCodeId: string): Promise<IndividualQrCodeUsage> {
        return new Promise<IndividualQrCodeUsage>((resolve, reject) => {
            this.authenticationService.get<IndividualQrCodeUsage>
            ('/profile/' + this.authenticationService.getCurrentProfile() + '/subscriptions/qrcode/' + qrCodeId + '/usage/',
                data => {
                    resolve(data);
                },
                error => {
                    reject(error);
                });
        });
    }
}
