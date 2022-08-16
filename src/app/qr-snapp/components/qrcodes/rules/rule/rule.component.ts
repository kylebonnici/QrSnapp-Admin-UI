import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QrcodeRuleService} from '../../../../services/qrcode-rule.service';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, Validators} from '@angular/forms';
import {ComparisonType, DayOfTheWeek, QrCodeRule} from '../../../../models/backend/qrCodeRule';
import {ValueDataPair} from '../../../../models/ui/valueDataPair';
import {ApiError, ApiErrorCode} from '../../../../models/apiError';


export interface ListCheckBox<T> {
    name: T;
    selected: boolean;
}

@Component({
    selector: 'app-rule',
    templateUrl: './rule.component.html',
    styleUrls: ['./rule.component.css']
})
export class RuleComponent implements OnInit {

    @Input() set qrCodeRule(qrCodeRule: QrCodeRule) {
        if (qrCodeRule) {
            this.qrCodeRuleCopy = Object.assign({}, qrCodeRule);
            this.isEnabled = qrCodeRule.enabled;
            this.priority.setValue(qrCodeRule.priority);
            this.friendlyName.setValue(qrCodeRule.friendlyName);
            this.defaultRedirect.setValue(qrCodeRule.redirectURL);
            this.fromValid.setValue(qrCodeRule.validFromDate);
            this.toValid.setValue(qrCodeRule.validToDate);
            this.fromTime.setValue(qrCodeRule.validFromTime);
            this.toTime.setValue(qrCodeRule.validToTime);
            this.countPersistenceDuration.setValue((qrCodeRule.countPersistenceDuration));
            if (qrCodeRule.comparisonType) {
                this.startValueComparisonType = qrCodeRule.comparisonType;
                this.min.setValue(qrCodeRule.minCount);

                if (qrCodeRule.comparisonType === ComparisonType.BETWEEN || qrCodeRule.comparisonType === ComparisonType.EXCLUSION) {
                    this.max.setValue(qrCodeRule.maxCount);
                }
            }

            this.daysOfTheWeek.forEach(dayOfWeek => {
                dayOfWeek.selected = qrCodeRule.validDays.indexOf(dayOfWeek.name) !== -1;
            });
        } else {
            this.clearAll();
        }
    }

    qrCodeRuleCopy: QrCodeRule;
    @Output() dismiss = new EventEmitter<void>();
    validStates: ValueDataPair[] =
        [
            {value: '', data: ComparisonType.GREATER},
            {value: '', data: ComparisonType.EQUAL},
            {value: '', data: ComparisonType.BETWEEN},
            {value: '', data: ComparisonType.LESS},
            {value: '', data: ComparisonType.EXCLUSION},
        ];

    constructor(public qrcodeRuleService: QrcodeRuleService,
                private authenticationService: AuthenticationService,
                private translateService: TranslateService) {
        for (const pair of this.validStates) {
            pair.value = this.translateService.instant('COMMON.ENUM.COMPARISON_TYPE.' + pair.data.toString().toUpperCase());
        }
    }

    pageTranslationID = 'QRCODE_RULE.';

    isEnabled: boolean;
    countPersistenceDuration = new FormControl('', [Validators.pattern('^[0-9]*$')]);
    priority = new FormControl();
    min = new FormControl('', [() => {
        if (this.min) {
            if (this.selectedComparisonType !== null && !(this.min.value && this.min.value !== '')) {
                return {required: true};
            }
        }

        if (this.max && this.min.value && this.max.value) {
            if (this.min.value > this.max.value) {
                return {minGreaterThanMax: true};
            }

            setTimeout(() => {
                if (this.max.hasError('minGreaterThanMax')) {
                    this.max.setValue(this.max.value);
                }
            }, 1);
        }

        return null;
    }]);
    max = new FormControl('', [() => {
        if (this.max) {
            if ((this.selectedComparisonType === ComparisonType.BETWEEN ||
                this.selectedComparisonType === ComparisonType.EXCLUSION)
                && !(this.max.value && this.max.value !== '')) {
                return {required: true};
            }
        }

        if (this.max && this.min.value && this.max.value) {
            if (this.min.value > this.max.value) {
                return {minGreaterThanMax: true};
            }

            setTimeout(() => {
                if (this.min.hasError('minGreaterThanMax')) {
                    this.min.setValue(this.min.value);
                }
            }, 1);
        }

        return null;
    }]);

    openGeneral = false;

    friendlyName = new FormControl('', [Validators.required]);
    defaultRedirect = new FormControl('', [Validators.required]);
    fromValid = new FormControl('', [() => {
        if (this.toValid && this.fromValid.value && this.toValid.value) {
            if (this.fromValid.value > this.toValid.value) {
                return {notValidDatesRange: true};
            }

            setTimeout(() => {
                if (this.toValid.hasError('notValidDatesRange')) {
                    this.toValid.setValue(this.toValid.value);
                }
            }, 1);
        }

        return null;
    }]);

    toValid = new FormControl('', [() => {
        if (this.fromValid.value && this.toValid.value) {
            if (this.fromValid.value > this.toValid.value) {
                return {notValidDatesRange: true};
            }

            setTimeout(() => {
                if (this.fromValid.hasError('notValidDatesRange')) {
                    this.fromValid.setValue(this.fromValid.value);
                }
            }, 1);
        }

        return null;
    }]);

    fromTime = new FormControl('', [() => {
        if (this.toTime && this.fromTime.value && this.toTime.value) {
            if (this.fromTime.value >= this.toTime.value) {
                return {notValidTimeRange: true};
            }

            setTimeout(() => {
                if (this.toTime.hasError('notValidTimeRange')) {
                    this.toTime.setValue(this.toTime.value);
                }
            }, 1);
        }

        return null;
    }]);

    toTime = new FormControl('', [() => {
        if (this.fromTime.value && this.toTime.value) {
            if (this.fromTime.value >= this.toTime.value) {
                return {notValidTimeRange: true};
            }
            setTimeout(() => {
                if (this.fromTime.hasError('notValidTimeRange')) {
                    this.fromTime.setValue(this.fromTime.value);
                }
            }, 1);
        }

        return null;
    }]);

    daysOfTheWeek: ListCheckBox<DayOfTheWeek>[] =
        [
            {name: DayOfTheWeek.MONDAY, selected: false},
            {name: DayOfTheWeek.TUESDAY, selected: false},
            {name: DayOfTheWeek.WEDNESDAY, selected: false},
            {name: DayOfTheWeek.THURSDAY, selected: false},
            {name: DayOfTheWeek.FRIDAY, selected: false},
            {name: DayOfTheWeek.SATURDAY, selected: false},
            {name: DayOfTheWeek.SUNDAY, selected: false},
        ];

    selectedComparisonType: ComparisonType;
    startValueComparisonType: ComparisonType;

    isValid(): boolean {
        return !this.priority.hasError('required') &&
            !this.friendlyName.hasError('required') &&
            !this.defaultRedirect.hasError('required') &&
            !this.defaultRedirect.hasError('pattern') &&
            this.isMinValid() &&
            this.isMaxValid() &&
            !this.countPersistenceDuration.hasError('pattern') &&
            !this.fromValid.hasError('notValidDatesRange') &&
            !this.toValid.hasError('notValidDatesRange') &&
            !this.fromTime.hasError('notValidTimeRange') &&
            !this.toTime.hasError('notValidTimeRange')
            ;
    }

    private isMinValid(): boolean {
        return this.selectedComparisonType === null ||
            (this.min.value && this.min.value !== '' && !this.min.hasError('minGreaterThanMax'));
    }

    private isMaxValid(): boolean {
        return (this.selectedComparisonType === null || (this.selectedComparisonType !== ComparisonType.BETWEEN &&
            this.selectedComparisonType !== ComparisonType.EXCLUSION)) ||
            (this.max.value && this.max.value !== '' && !this.max.hasError('minGreaterThanMax'));
    }

    private clearAll(): void {
        this.priority.reset();
        this.friendlyName.reset();
        this.defaultRedirect.reset();
        this.fromValid.reset();
        this.toValid.reset();
        this.fromTime.reset();
        this.toTime.reset();
        this.countPersistenceDuration.reset();
        this.isEnabled = false;

        this.daysOfTheWeek.forEach(dayOfWeek => {
            dayOfWeek.selected = false;
        });

        this.startValueComparisonType = ComparisonType.BETWEEN;
        this.startValueComparisonType = null;
        this.min.setValue(null);
        this.max.setValue(null);
        this.qrCodeRuleCopy = null;
    }

    getErrorMessage(formControl: FormControl): string {
        if (formControl.hasError('required')) {
            return this.translateService.instant('COMMON.VALIDATION.REQUIRED');
        } else if (formControl.hasError('notValidDatesRange')) {
            return this.translateService.instant('COMMON.VALIDATION.DATE_RANGE');
        } else if (formControl.hasError('notValidTimeRange')) {
            return this.translateService.instant('COMMON.VALIDATION.TIME_RANGE');
        } else if (formControl.hasError('minGreaterThanMax')) {
            return this.translateService.instant('COMMON.VALIDATION.NUMBER_RANGE');
        } else if (formControl.hasError('indexInUse')) {
            return this.translateService.instant('COMMON.VALIDATION.NOT_UNIQUE');
        } else if (formControl.hasError('pattern')) {
            if (formControl === this.countPersistenceDuration) {
                return this.translateService.instant('COMMON.VALIDATION.INTEGER_NUMBER_ONLY');
            } else if (formControl === this.defaultRedirect) {
                return this.translateService.instant('COMMON.VALIDATION.URL_PATTERN');
            }
        } else {
            return '';
        }
    }

    save(): void {
        const ruleToSave = new QrCodeRule();
        ruleToSave.friendlyName = this.friendlyName.value;
        ruleToSave.priority = this.priority.value;
        ruleToSave.redirectURL = this.defaultRedirect.value;
        ruleToSave.enabled = this.isEnabled;

        if (this.fromValid.value) {
            ruleToSave.validFromDate = this.fromValid.value;
        }

        if (this.toValid.value) {
            ruleToSave.validToDate = this.toValid.value;
        }

        if (this.toTime.value) {
            ruleToSave.validToTime = this.toTime.value;
        }

        if (this.fromTime.value) {
            ruleToSave.validFromTime = this.fromTime.value;
        }

        if (this.countPersistenceDuration.value) {
            ruleToSave.countPersistenceDuration = this.countPersistenceDuration.value;
        }

        if (this.selectedComparisonType) {
            ruleToSave.comparisonType = this.selectedComparisonType;
            ruleToSave.minCount = this.min.value;

            if (this.selectedComparisonType === ComparisonType.BETWEEN || this.selectedComparisonType === ComparisonType.EXCLUSION) {
                ruleToSave.maxCount = this.max.value;
            }
        }

        this.daysOfTheWeek.forEach(dayOfWeek => {
            if (dayOfWeek.selected) {
                ruleToSave.validDays.push(dayOfWeek.name);
            }
        });

        if (this.qrCodeRuleCopy) { // EDIT
            ruleToSave.id = this.qrCodeRuleCopy.id;
            this.qrcodeRuleService.edit(this.qrCodeRuleCopy, ruleToSave, this.qrCodeRuleCopy.id).then(() => {
                this.clearAll();
                this.dismiss.emit();
            }).catch(error => this.processError(error));
        } else {
            this.qrcodeRuleService.add(ruleToSave).then(() => {
                    this.clearAll();
                    this.dismiss.emit();
                }
            ).catch(error => this.processError(error));
        }
    }

    private processError(apiError: ApiError) {
        if (apiError.code === ApiErrorCode.INDEX_ALREADY_IN_USE) {
            this.priority.setErrors({indexInUse: true});
            this.openGeneral = true;
        } else {
            this.clearAll();
            this.dismiss.emit();
        }
    }

    ngOnInit(): void {
    }

}
