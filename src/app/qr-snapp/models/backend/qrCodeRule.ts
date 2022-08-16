import {Time} from '@angular/common';

export class QrCodeRule {
    constructor() {
        this.validDays = [];
    }

    id: number;
    enabled: boolean;
    priority: number;
    validDays: DayOfTheWeek[];
    validFromDate: Date;
    validToDate: Date;
    validFromTime: Time;
    validToTime: Time;
    friendlyName: string;
    redirectURL: string;
    minCount: number;
    maxCount: number;
    countPersistenceDuration: number;
    comparisonType: ComparisonType;
}

export enum DayOfTheWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}


export enum ComparisonType {
    EQUAL = 'EQUAL',
    LESS = 'LESS',
    GREATER = 'GREATER',
    BETWEEN = 'BETWEEN',
    EXCLUSION = 'EXCLUSION'
}
