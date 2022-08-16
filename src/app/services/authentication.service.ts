import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiError, ApiErrorCode} from '../qr-snapp/models/apiError';
import {User} from '../qr-snapp/models/user';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient,
                private activatedRoute: ActivatedRoute,
                public router: Router) {
        this.token = localStorage.getItem('x-auth-token');
        this.headers = new HttpHeaders({
            'x-auth-token': this.token,
            'X-Requested-With': 'XMLHttpRequest'
        });
    }

    domain = 'https://resolve.qrsnapp.com';
    // serverBaseUrl = 'https://api.qrsnapp.com/api';
    serverBaseUrl = 'http://127.0.0.1:5000/api';
    loginApiUrl = '/login/';
    logoutApiUrl = '/logout/';

    goBackOnLogin = false;
    authenticated = false;
    token: string;
    headers: HttpHeaders;

    private static isApiError(obj: any): boolean {
        return 'description' in obj && 'code' in obj && 'metaData' in obj;
    }

    private execute<T>(fn: () => Observable<T>,
                       onSuccess: (obj: T | null) => void,
                       onApiError: (apiError: ApiError) => void,
                       onComplete = () => {
                       },
                       checkToken = true): void {
        if (checkToken && !this.token) {
            this.redirectToLoginPage();
            const apiError = new ApiError();
            apiError.code = ApiErrorCode.NOT_LOGGED_IN;
            onApiError(apiError);
            this.goBackOnLogin = true;
            return;
        }

        fn().subscribe(
            next => {
                onSuccess(next);
                onComplete();
                this.goBackOnLogin = false;
            },
            error => {
                this.errorHandling(error as HttpErrorResponse, onApiError);
                onComplete();
            });
    }

    authenticate(credentials): Promise<void> {
        return new Promise<void>(((resolve, rejects) => {
                const headers = new HttpHeaders({
                    authorization: ('Basic ' + btoa(credentials.username + ':' + credentials.password)),
                    'X-Requested-With': 'XMLHttpRequest'
                });

                this.http.get(this.serverBaseUrl + this.loginApiUrl, {headers, observe: 'response'}).subscribe(response => {
                    this.token = response.headers.get('x-auth-token');
                    if (this.token) {
                        this.headers = new HttpHeaders({
                            'x-auth-token': this.token,
                            'X-Requested-With': 'XMLHttpRequest'
                        });
                        this.authenticated = true;
                        localStorage.setItem('x-auth-token', this.token);
                        localStorage.setItem('currentProfile', encodeURIComponent(credentials.username));
                        resolve(null);
                    } else {
                        this.authenticated = false;
                        localStorage.setItem('x-auth-token', null);
                        localStorage.setItem('currentProfile', null);
                        rejects(null);
                    }
                }, error => {
                    this.authenticated = false;
                    localStorage.setItem('x-auth-token', null);
                    localStorage.setItem('currentProfile', null);
                    rejects(error);
                });
            })
        );
    }

    get<T>(url: string,
           onSuccess: (obj: T) => void,
           onApiError: (apiError: ApiError) => void,
           onComplete = () => {
           },
           checkToken = true): void {
        const headers = this.headers;
        return this.execute<T>(() => this.http.get<T>(this.serverBaseUrl + url, checkToken ? {headers} : {}),
            onSuccess, onApiError, onComplete, checkToken);
    }

    delete(url: string,
           onSuccess: () => void,
           onApiError: (apiError: ApiError) => void,
           onComplete = () => {
           }): void {
        const headers = this.headers;
        return this.execute<void>(() => this.http.delete<void>(this.serverBaseUrl + url, {headers}),
            onSuccess, onApiError, onComplete);
    }

    put<T>(url: string,
           data: T,
           onSuccess: (obj: T) => void,
           onApiError: (apiError: ApiError) => void,
           onComplete = () => {
           }): void {
        const headers = this.headers;
        return this.execute<T>(() => this.http.put<T>(this.serverBaseUrl + url, data, {headers}),
            onSuccess, onApiError, onComplete);
    }

    post<T>(url: string,
            data: T,
            onSuccess: (obj: T) => void,
            onApiError: (apiError: ApiError) => void,
            onComplete = () => {
            }): void {
        const headers = this.headers;
        return this.execute<T>(() => this.http.post<T>(this.serverBaseUrl + url, data, {headers}),
            onSuccess, onApiError, onComplete);
    }

    postAny<T>(url: string,
               data: any,
               onSuccess: (obj: T) => void,
               onApiError: (apiError: ApiError) => void,
               onComplete = () => {
               }): void {
        const headers = this.headers;
        return this.execute<T>(() => this.http.post<T>(this.serverBaseUrl + url, data, {headers}),
            onSuccess, onApiError, onComplete);
    }

    postNoHeader<T>(url: string,
                    data: T,
                    onSuccess: (obj: T) => void,
                    onApiError: (apiError: ApiError) => void,
                    onComplete = () => {
                    }): void {
        return this.execute<T>(() => this.http.post<T>(this.serverBaseUrl + url, data),
            onSuccess, onApiError, onComplete, false);
    }

    logout() {
        this.get(this.logoutApiUrl, () => {
            this.authenticated = false;
            this.token = null;
            this.redirectToLoginPage();
        }, null, null);
    }

    getCurrentProfile(): string {
        return localStorage.getItem('currentProfile');
    }

    getLoggedUser(): Promise<User> {
        return new Promise<User>(((resolve, rejects) => {
                this.get<User>('/user/',
                    user => {
                        resolve(user);
                    }, error => {
                        rejects(error);
                    });
            })
        );
    }

    errorHandling(error: HttpErrorResponse, onApiError: (apiError: ApiError) => void): void {
        if (error.status === 401) {
            this.redirectToLoginPage();
            this.goBackOnLogin = true;
            return;
        }

        this.goBackOnLogin = false;

        if (error.status === 200 && error.ok === false) {
            this.redirectToLoginPage();
            console.log(error);
        } else {
            if (error.error && onApiError && AuthenticationService.isApiError(error.error)) {
                onApiError(error.error as ApiError);
            } else {
                const apiError = new ApiError();
                apiError.code = ApiErrorCode.UNKNOWN_ERROR;
                apiError.description = error.message;
                apiError.metaData =  new Map<string, any>();
                apiError.metaData.set('error', error);
                onApiError(apiError);
                console.log(error);
            }
        }
    }

    private redirectToLoginPage(): void {
        this.authenticated = false;
        this.token = null;
        localStorage.removeItem('x-auth-token');
        this.router.navigate(['/login']);
    }

    redirectToMainPage(): void {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params.qrCodeSubscription) {
                this.router.navigate(['/profile/' + this.getCurrentProfile() + '/subscriptions'],
                    { queryParamsHandling: 'preserve' });
            } else {
                this.router.navigate(['/profile/' + this.getCurrentProfile() + '/dashboard']);
            }
        });
    }
}
