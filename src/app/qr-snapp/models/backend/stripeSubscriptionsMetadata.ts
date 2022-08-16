import {flatMap} from 'rxjs/internal/operators';

export class StripeSubscriptionsMetadata {
    publishableKey: string;
    prices: {
        qrcodePrice: string,
        qrcodeProduct: string,
    };
}
