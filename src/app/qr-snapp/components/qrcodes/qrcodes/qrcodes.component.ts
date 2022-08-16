import {Component} from '@angular/core';
import {BaseDataControllerComponent} from '../../common/base-data-controller/base-data-controller.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {TableColumnDefinition} from '../../../models/ui/tableColumnDefinition';
import {FilterType} from '../../../models/ui/filterType';
import {TableActions} from '../../../models/ui/tableActions';
import {GroupQRCodesService} from '../../../services/group-qrcodes.service';
import {QrCodeAddEditDialogComponent} from '../qrcode-add-edit-dialog/qr-code-add-edit-dialog.component';
import {GroupService} from '../../../services/group.service';
import {QrCode} from '../../../models/backend/qrCode';
import {Group} from '../../../models/backend/group';
import {QrCodeDialogComponent} from '../../common/qr-code-dialog/qr-code-dialog.component';
import {StripeSubscriptionsService} from '../../../services/stripe-subscriptions.service';

@Component({
    selector: 'app-qrcodes',
    templateUrl: './qrcodes.component.html',
    styleUrls: ['./qrcodes.component.css']
})
export class QRCodesComponent extends BaseDataControllerComponent<QrCode> {

    constructor(protected dialog: MatDialog,
                public groupQRCodesService: GroupQRCodesService,
                private groupService: GroupService,
                private authenticationService: AuthenticationService,
                private stripeSubscriptionsService: StripeSubscriptionsService,
                private router: Router,
                private activateRouter: ActivatedRoute,
                protected translateService: TranslateService) {
        super(groupQRCodesService, dialog, translateService);
        this.hasSelection = true;
        this.hasActions = true;

        this.activateRouter.params.subscribe(params => {
            this.groupQRCodesService.groupId = params.groupId;
            this.groupQRCodesService.getAll();

            this.groupService.get(groupQRCodesService.groupId).then(group => {
                this.group = group;
                this.groupName = group.name;
            });
        });

        this.prepareFilters();
        this.prepareTableColumnDefinitions();
        this.prepareTableRowActions();
    }

    group: Group;
    groupName: string;
    pageTranslationID = 'QRCODES.';

    private prepareTableColumnDefinitions(): void {
        const friendlyNameTableColumnDefinition = new TableColumnDefinition();
        friendlyNameTableColumnDefinition.code = 'friendly_name';
        friendlyNameTableColumnDefinition.getData = (qrCode: QrCode): string => qrCode.friendlyName;

        this.tableColumnDefinitions.push(friendlyNameTableColumnDefinition);


        const fallbackURLTableColumnDefinition = new TableColumnDefinition();
        fallbackURLTableColumnDefinition.code = 'fallback_URL';
        fallbackURLTableColumnDefinition.getData = (qrCode: QrCode): string => qrCode.defaultRedirect;

        this.tableColumnDefinitions.push(fallbackURLTableColumnDefinition);

        const timeZoneTableColumnDefinition = new TableColumnDefinition();
        timeZoneTableColumnDefinition.code = 'zone_id';
        timeZoneTableColumnDefinition.getData = (qrCode: QrCode): string => qrCode.zoneId;

        this.tableColumnDefinitions.push(timeZoneTableColumnDefinition);

        const enabledTableColumnDefinition = new TableColumnDefinition();
        enabledTableColumnDefinition.code = 'enabled';
        enabledTableColumnDefinition.getData = (qrCode: QrCode): string => this.translateService.instant(
            'COMMON.ACTION.' + (qrCode.enabled === true ? 'YES' : 'NO'));

        this.tableColumnDefinitions.push(enabledTableColumnDefinition);

        const maxScansTableColumnDefinition = new TableColumnDefinition();
        maxScansTableColumnDefinition.code = 'max_scans';
        maxScansTableColumnDefinition.getData = (qrCode: QrCode): string | number =>
            (qrCode.maxBillingCycleScans ? qrCode.maxBillingCycleScans : this.translateService.instant('COMMON.LABEL.UNLIMITED'));

        this.tableColumnDefinitions.push(maxScansTableColumnDefinition);

        const totalScansTableColumnDefinition = new TableColumnDefinition();
        totalScansTableColumnDefinition.code = 'CURRENT_SCANS';
        totalScansTableColumnDefinition.getData = (qrCode: QrCode): string | number => {
            if (qrCode.totalScans === undefined) {
                this.stripeSubscriptionsService.getIndividualQrCodeSubscriptionUsage(qrCode.id).then(scans => {
                    qrCode.totalScans = scans.totalScans;
                    qrCode.billPeriod = scans.billPeriod;
                });
            }

            return qrCode.totalScans;
        };

        this.tableColumnDefinitions.push(totalScansTableColumnDefinition);

        const totalBillScansTableColumnDefinition = new TableColumnDefinition();
        totalBillScansTableColumnDefinition.code = 'CURRENT_SCANS_BILL';
        totalBillScansTableColumnDefinition.getData = (qrCode: QrCode): string | number => {
            if (qrCode.totalScans === undefined === undefined) {
                this.stripeSubscriptionsService.getIndividualQrCodeSubscriptionUsage(qrCode.id).then(scans => {
                    qrCode.totalScans = scans.totalScans;
                    qrCode.billPeriod = scans.billPeriod;
                });
            }

            return qrCode.billPeriod;
        };

        this.tableColumnDefinitions.push(totalBillScansTableColumnDefinition);
    }

    private prepareFilters(): void {
        const friendlyNameFilter = new FilterType<QrCode>();
        friendlyNameFilter.code = 'Friendly_Name';
        friendlyNameFilter.predicate = (qrCode: QrCode, f): boolean => {
            return qrCode.friendlyName.startsWith(f);
        };

        this.filterTypes.push(friendlyNameFilter);

        const fallbackURLFilter = new FilterType<QrCode>();
        fallbackURLFilter.code = 'Fallback_URL';
        fallbackURLFilter.predicate = (qrCode: QrCode, f): boolean => {
            return qrCode.defaultRedirect.startsWith(f);
        };

        this.filterTypes.push(fallbackURLFilter);
    }

    private prepareTableRowActions(): void {
        const editTableAction = new TableActions<QrCode>();
        editTableAction.matIcon = 'edit';
        editTableAction.action = (qrCode: QrCode) => this.edit(qrCode);
        editTableAction.isDisabled = () => false;
        editTableAction.isVisible = () => true;
        editTableAction.tooltip = () => this.translateService.instant('COMMON.TOOLTIP.EDIT');
        editTableAction.color = () => 'primary';

        this.tableActions.push(editTableAction);

        const rulesTableAction = new TableActions<QrCode>();
        rulesTableAction.matIcon = 'rule';
        rulesTableAction.action = (qrCode: QrCode) => this.details(qrCode);
        rulesTableAction.isDisabled = () => false;
        rulesTableAction.isVisible = () => true;
        rulesTableAction.tooltip = () => this.translateService.instant(this.pageTranslationID + 'TOOLTIP.MANAGE_QRCODE_RULES');
        rulesTableAction.color = () => 'primary';

        this.tableActions.push(rulesTableAction);

        const showQrCodeTableAction = new TableActions<QrCode>();
        showQrCodeTableAction.matIcon = 'qr_code';
        showQrCodeTableAction.action = (qrCode: QrCode) => {
            this.dialog.open(QrCodeDialogComponent, {
                data: {
                    title: 'Qr Code - ' + qrCode.friendlyName ,
                    qrCodeString: this.authenticationService.domain + '/resolver/' + qrCode.id,
                }
            });
        };
        showQrCodeTableAction.isDisabled = () => false;
        showQrCodeTableAction.isVisible = () => true;
        showQrCodeTableAction.tooltip = () => this.translateService.instant(this.pageTranslationID + 'TOOLTIP.VIEW_QRCODE');
        showQrCodeTableAction.color = () => 'primary';

        this.tableActions.push(showQrCodeTableAction);
    }

    add(): void {
        this.dialog.open(QrCodeAddEditDialogComponent, {
            data: {
                title: this.pageTranslationID + 'LABEL.NEW_QRCODE',
                placeholder: this.pageTranslationID + 'LABEL.NAME',
                value: ''
            }
        });
    }

    edit(qrCode: QrCode): void {
        this.dialog.open(QrCodeAddEditDialogComponent, {
            data: {
                qrcode: qrCode,
                placeholder: this.pageTranslationID + 'LABEL.NAME',
                title: this.pageTranslationID + 'LABEL.EDIT_QRCODE',
                bEdit: true
            }
        });
    }

    details(qrCode: QrCode): void {
        this.router.navigate(['/profile/' + this.authenticationService.getCurrentProfile() +
        '/groups/' + this.group.id + '/qrcodes/' + qrCode.id + '/rules']);
    }
}
