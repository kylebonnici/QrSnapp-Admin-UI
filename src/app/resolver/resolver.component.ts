import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QrCodeResolverService} from './services/qr-code-resolver.service';
import {DOCUMENT} from '@angular/common';
import {ApiError, ApiErrorCode} from '../qr-snapp/models/apiError';

@Component({
    selector: 'app-resolver',
    templateUrl: './resolver.component.html',
    styleUrls: ['./resolver.component.css']
})
export class ResolverComponent implements OnInit {

    constructor(private activateRouter: ActivatedRoute,
                private qrCodeResolverService: QrCodeResolverService,
                @Inject(DOCUMENT) private document: Document) {
        this.loading = true;
        this.message = 'RESOLVE.REDIRECTING';
        this.activateRouter.params.subscribe(params => {
            this.qrCodesId = params.qrCodeId;

            qrCodeResolverService.resolveQrCode(this.qrCodesId).then(resolverDTO => {
                let url =  resolverDTO.redirectURL;
                if (!url.match(/^http?:\/\//i) || !url.match(/^https?:\/\//i)) {
                    url = 'http://' + url;
                }

                document.location.href = url;
            }).catch((apiError: ApiError) => {
                    this.error = true;
                    this.loading = false;
                    if (apiError.code === ApiErrorCode.NOT_FOUND) {
                        this.message = 'RESOLVE.INVALID_QRCODE';
                    }
                    else if (apiError.code === ApiErrorCode.UNPAID_SUBSCRIPTION) {
                        this.message = 'RESOLVE.UNPAID_SUBSCRIPTION';
                    }
                    else if (apiError.code === ApiErrorCode.UNKNOWN_ERROR) {
                        this.message = 'RESOLVE.UNKNOWN_ERROR';
                        console.log(apiError);
                    }
                });
        });
    }

    error: boolean;
    qrCodesId: string;
    message: string;
    loading: boolean;

    ngOnInit(): void {
    }

}
