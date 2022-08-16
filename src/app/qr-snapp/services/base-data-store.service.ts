import {BehaviorSubject, Observable} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';
import {ApiError, ApiErrorCode} from '../models/apiError';
import {NotificationsService} from './notifications.service';
import {SystemNotification} from '../models/ui/notification';

export abstract class IDataStore<T> {
    abstract getAll(): Promise<T[]>;

    abstract get(id: any): Promise<T>;

    abstract add(data: T): Promise<T>;

    abstract edit(oldData: T, updatedData: T, id: any): Promise<T>;

    abstract delete(data: T): Promise<void>;

    abstract isSameId(rhs: T, lhs: T): boolean;

    protected abstract getAllApiUrl(): string;

    protected abstract getOneApiUrl(id: any): string;

    protected abstract addApiUrl(data: T): string;

    protected abstract deleteApiUrl(data: T): string;

    protected abstract updateApiUrl(data: T): string;

    protected abstract postGetDataProcessing(data: T): void;

    abstract get observable(): Observable<T[]>;
}

export abstract class BaseDataStoreService<T> extends IDataStore<T> {
    public localData: BehaviorSubject<T[]>;
    protected dataStore: T[];

    queriesInProgress: number;

    protected constructor(protected authenticationService: AuthenticationService,
                          protected notificationsService: NotificationsService) {
        super();

        this.queriesInProgress = 0;
        this.dataStore = [];
        this.localData = new BehaviorSubject<T[]>([]);
    }

    get observable(): Observable<T[]> {
        return this.localData.asObservable();
    }

    getAll(): Promise<T[]> {
        return new Promise<T[]>((resolve, rejects) => {
            this.queriesInProgress++;

            this.authenticationService.get<T[]>(this.getAllApiUrl(),
                allData => {
                    for (const data of allData) {
                        this.postGetDataProcessing(data);
                    }

                    this.dataStore = allData;
                    this.localData.next(this.dataStore);

                    resolve(allData);
                }, error => {
                    rejects(error);
                }, () => this.queriesInProgress--);
        });
    }

    get(id: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
                this.queriesInProgress++;

                this.authenticationService.get<T>(this.getOneApiUrl(id),
                    data => {
                        this.queriesInProgress--;
                        resolve(data);
                    },
                    error => {
                        this.queriesInProgress--;
                        reject(error);
                    });
            }
        );
    }

    add(data: T): Promise<T> {
        return new Promise<T>(((resolve, rejects) => {
                this.queriesInProgress++;
                this.authenticationService.post<T>(this.addApiUrl(data), data,
                    (response: T) => {
                        this.postGetDataProcessing(response);
                        this.dataStore.unshift(response);
                        this.localData.next(this.dataStore);

                        const notification = this.addSuccessNotification(response);

                        this.notificationsService.registerNotification(notification);

                        resolve(response);
                    }, error => {
                        this.notificationsService.registerNotification(this.addFailNotification(data, error));
                        rejects(error);
                    }, () => this.queriesInProgress--);
            })
        );
    }

    edit(oldData: T, updatedData: T, id: any): Promise<T> {
        return new Promise<T>(((resolve, rejects) => {
                this.queriesInProgress++;
                this.authenticationService.put<T>(this.updateApiUrl(oldData), updatedData,
                    (response: T) => {
                        this.postGetDataProcessing(response);
                        const index = this.dataStore.findIndex(dataInStore => this.isSameId(dataInStore, updatedData));
                        this.dataStore[index] = response;
                        this.localData.next(this.dataStore);

                        const notification = this.editSuccessNotification(oldData, response);

                        this.notificationsService.registerNotification(notification);

                        resolve(response);
                    }, error => {
                        if (error.code === ApiErrorCode.USER_NOT_FOUND || error.code === ApiErrorCode.NOT_FOUND) {
                            this.removeElementFromStore(updatedData);
                        }

                        this.notificationsService.registerNotification(this.editFailNotification(updatedData, error));
                        rejects(error);
                    }, () => this.queriesInProgress--);
            })
        );
    }

    delete(data: T): Promise<void> {
        return new Promise<void>(((resolve, rejects) => {
                this.queriesInProgress++;
                this.authenticationService.delete(this.deleteApiUrl(data),
                    () => {
                        this.removeElementFromStore(data);

                        const notification = this.deleteSuccessNotification(data);

                        this.notificationsService.registerNotification(notification);

                        resolve(null);
                    }, error => {
                        this.notificationsService.registerNotification(this.deleteFailNotification(data, error));
                        switch (error.code) {
                            case ApiErrorCode.USER_NOT_FOUND || ApiErrorCode.NOT_FOUND:
                                this.removeElementFromStore(data);
                                resolve(null);
                                break;
                            default:
                                rejects(error);
                        }
                    }, () => this.queriesInProgress--);
            })
        );
    }

    private removeElementFromStore(data: T): void {
        const index = this.dataStore.findIndex(dataInStore => this.isSameId(dataInStore, data));
        this.dataStore.splice(index, 1);
        this.localData.next(this.dataStore);
    }

    public isQueryInProgress(): boolean {
        return this.queriesInProgress !== 0;
    }

    abstract addSuccessNotification(data: T): SystemNotification;
    abstract editSuccessNotification(oldData: T, newData: T): SystemNotification;
    abstract deleteSuccessNotification(data: T): SystemNotification;

    abstract addFailNotification(data: T, apiError: ApiError): SystemNotification;
    abstract editFailNotification(data: T, apiError: ApiError): SystemNotification;
    abstract deleteFailNotification(data: T, apiError: ApiError): SystemNotification;
}
