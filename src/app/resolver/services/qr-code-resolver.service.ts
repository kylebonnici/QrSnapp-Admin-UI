import {Injectable} from '@angular/core';
import {ResolveMetaDataDTO} from '../models/resolveMetaDataDTO';
import {AuthenticationService} from '../../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class QrCodeResolverService {

    constructor(private authenticationService: AuthenticationService) {
    }

    public resolveQrCode(qrCodeId: string): Promise<ResolveMetaDataDTO> {
        return new Promise<ResolveMetaDataDTO>(((resolve, rejects) => {
                this.authenticationService.get<ResolveMetaDataDTO>('/public/resolve/qrcodes/' + qrCodeId ,
                    (response) => {
                        resolve(response);
                    },
                    (apiError) => {
                        rejects(apiError);
                    }, () => {}, false);
            })
        );
    }

}
