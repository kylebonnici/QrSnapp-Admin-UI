import {Injectable, isDevMode, OnDestroy} from '@angular/core';
import {SystemNotification} from '../models/ui/notification';
import {BehaviorSubject, Observable} from 'rxjs';
import {TimeService} from './time.service';


@Injectable({
    providedIn: 'root'
})
export class NotificationsService implements OnDestroy {

    public latestNotification: BehaviorSubject<SystemNotification>;
    protected dataStore: SystemNotification[];
    maxCount = 100;

    constructor(private timeService: TimeService) {
        if (isDevMode()) {
            this.maxCount = 5;
        }
        this.dataStore = JSON.parse(localStorage.getItem('notifications'));

        if (!this.dataStore) {
            this.dataStore = [];
        }

        this.latestNotification = new BehaviorSubject<SystemNotification>(null);

        this.start();
    }

    get observable(): Observable<SystemNotification> {
        return this.latestNotification.asObservable();
    }

    get notifications(): SystemNotification[] {
        return this.dataStore;
    }

    getNotificationKeys(): string[] {
        const keys = [];

        for (const notification of this.dataStore) {
            keys.push(notification.code);
        }

        const set = new Set(keys);
        return Array.from(set.values());
    }

    registerNotification(notification: SystemNotification): void {
        if (notification.persist) {
            this.dataStore.unshift(notification);

            if (this.countItems() > this.maxCount) {
                this.clearItem(this.dataStore[this.dataStore.length - 1]);
            } else {
                this.updateBrowserStore();
            }
        }

        this.latestNotification.next(notification);
    }

    clearAll(): void {
        this.dataStore = [];
        this.updateBrowserStore();
    }

    clearItem(notification: SystemNotification): void {
        const index = this.dataStore.indexOf(notification);

        if (index > -1) {
            this.dataStore.splice(index, 1);
        }

        this.updateBrowserStore();
    }

    clearGroup(type: string): void {
        const itemsToDelete = this.getSameTypeNotification(type);

        for (const notification of itemsToDelete) {
            this.clearItem(notification);
        }

        this.updateBrowserStore();
    }

    private updateBrowserStore(): void {
        localStorage.setItem('notifications', JSON.stringify(this.dataStore));
    }

    countItems(): number {
        return this.dataStore.length;
    }

    getSameTypeNotification(type: string): SystemNotification[] {
        const out = [];

        for (const notification of this.dataStore) {
            if (notification.code.toUpperCase() === type.toUpperCase()) {
                out.push(notification);
            }
        }

        return out;
    }

    private start(): void {
        window.addEventListener('storage', this.storageEventListener.bind(this));
    }

    private stop(): void {
        window.removeEventListener('storage', this.storageEventListener.bind(this));
    }

    private storageEventListener(event: StorageEvent) {
        if (event.storageArea === localStorage) {
            if (event.key === 'notifications') {
                localStorage.setItem('notifications', event.newValue);
                this.dataStore = JSON.parse(localStorage.getItem('notifications'));
            }
        }
    }

    ngOnDestroy(): void {
        this.stop();
    }
}
