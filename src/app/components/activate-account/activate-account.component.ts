import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-activate-account',
    templateUrl: './activate-account.component.html',
    styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {

    bMessage: boolean;
    message: string;
    bSuccessMessage: boolean;
    successMessage: string;
    username: string;
    token: string;

    constructor(private authenticationService: AuthenticationService,
                private http: HttpClient,
                public router: Router,
                private translateService: TranslateService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.username = params.username;
            this.token = params.token;
            this.save();
        });
    }

    activateUrl(token: string, username: string): string {
        return this.authenticationService.serverBaseUrl + '/activate?token=' + token + '&username=' + encodeURIComponent(username);
    }

    save(): void {
        this.http.put<void>(this.activateUrl(this.token, this.username), null)
            .subscribe(
                () => {
                    this.successMessage = 'COMMON.LABEL.YOU_MAY_CLOSE_WINDOW';
                    this.bSuccessMessage = true;
                }, error => {
                    if (error.status === 404) {
                        this.message = 'COMMON.MESSAGE.EXPIRED_TOKEN';
                        this.bMessage = true;
                    } else if (error.status === 406) {
                        this.router.navigate(['/login']);
                    } else {
                        console.log(error);
                    }
                }
            );
    }

    requestActivationTokenUrl(username: string): string {
        return this.authenticationService.serverBaseUrl + '/sendActivationToken?username=' + encodeURIComponent(username);
    }

    requestNewToken(): void {
        this.http.post<void>(this.requestActivationTokenUrl(this.username), null)
            .subscribe(
                () => {
                    this.message = 'COMMON.MESSAGE.EMAIL_SENT';
                    this.bMessage = true;
                }, error => {
                    if (error.status === 406) {
                        this.message = 'COMMON.MESSAGE.ACCOUNT_ALREADY_ACTIVE';
                        this.bMessage = true;
                    } else {
                        console.log(error);
                    }
                }
            );
    }
}
