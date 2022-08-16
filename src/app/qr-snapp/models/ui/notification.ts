import {ApiErrorCode} from '../apiError';

export class SystemNotification {

    constructor() {
        this.persist = true;
        this.snackbar = true;
        this.error = false;
        this.duration = 5000;
        this.apiError = null;
        this.timestamp = new Date();
        this.metadata = {};
        this.translatableMetadata = {};
        this.possibleErrors = [];
    }

    code: string;
    persist: boolean;
    snackbar: boolean;
    duration: number;
    timestamp: Date;
    metadata: object;
    translatableMetadata: object;
    apiError: ApiErrorCode;
    possibleErrors: ApiErrorCode[];
    error: boolean;
}
