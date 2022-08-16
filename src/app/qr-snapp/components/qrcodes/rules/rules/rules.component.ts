import {Component, ViewChild} from '@angular/core';
import {BaseDataControllerComponent} from '../../../common/base-data-controller/base-data-controller.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {TableColumnDefinition} from '../../../../models/ui/tableColumnDefinition';
import {FilterType} from '../../../../models/ui/filterType';
import {TableActions} from '../../../../models/ui/tableActions';
import {QrCodeRule} from '../../../../models/backend/qrCodeRule';
import {QrcodeRuleService} from '../../../../services/qrcode-rule.service';
import {GroupService} from '../../../../services/group.service';
import {Group} from '../../../../models/backend/group';
import {QrCode} from '../../../../models/backend/qrCode';
import {GroupQRCodesService} from '../../../../services/group-qrcodes.service';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
})
export class RulesComponent extends BaseDataControllerComponent<QrCodeRule> {

    constructor(protected dialog: MatDialog,
                public qrcodeRuleService: QrcodeRuleService,
                private authenticationService: AuthenticationService,
                private groupService: GroupService,
                private groupQRCodesService: GroupQRCodesService,
                private activateRouter: ActivatedRoute,
                protected translateService: TranslateService) {
        super(qrcodeRuleService, dialog, translateService);
        this.hasSelection = true;
        this.hasActions = true;

        this.activateRouter.params.subscribe(params => {
            this.qrcodeRuleService.qrCodeId = params.qrCodesId;
            this.qrcodeRuleService.getAll();

            this.groupService.get(params.groupId).then(group => {
                this.group = group;
                this.groupName = group.name;
            });

            this.groupQRCodesService.get(params.qrCodesId).then(qrCode => {
                this.qrCode = qrCode;
                this.qrCodeName = qrCode.friendlyName;
            });
        });

        this.prepareFilters();
        this.prepareTableColumnDefinitions();
        this.prepareTableRowActions();
    }

    groupName: string;
    qrCodeName: string;
    group: Group;
    qrCode: QrCode;
    pageTranslationID = 'QRCODE_RULES.';
    selectedRule: QrCodeRule;

    @ViewChild('ruleDrawer') public ruleDrawer: MatDrawer;


    private prepareTableColumnDefinitions(): void {
        const priorityTableColumnDefinition = new TableColumnDefinition();
        priorityTableColumnDefinition.code = 'priority';
        priorityTableColumnDefinition.getData = (qrCodeRule: QrCodeRule): number => qrCodeRule.priority;

        this.tableColumnDefinitions.push(priorityTableColumnDefinition);

        const nameTableColumnDefinition = new TableColumnDefinition();
        nameTableColumnDefinition.code = 'name';
        nameTableColumnDefinition.getData = (qrCodeRule: QrCodeRule): string => qrCodeRule.friendlyName;

        this.tableColumnDefinitions.push(nameTableColumnDefinition);

        const activeTableColumnDefinition = new TableColumnDefinition();
        activeTableColumnDefinition.code = 'enabled';
        activeTableColumnDefinition.getData = (qrCodeRule: QrCodeRule): string => qrCodeRule.enabled ? 'Yes' : 'No';

        this.tableColumnDefinitions.push(activeTableColumnDefinition);
    }

    private prepareFilters(): void {
        const fullNameFilter = new FilterType<QrCodeRule>();
        fullNameFilter.code = 'Name';
        fullNameFilter.predicate = (qrCodeRule: QrCodeRule, f): boolean => {
            return qrCodeRule.friendlyName.startsWith(f);
        };

        this.filterTypes.push(fullNameFilter);
    }

    private prepareTableRowActions(): void {
        const editTableAction = new TableActions<QrCodeRule>();
        editTableAction.matIcon = 'edit';
        editTableAction.action = (qrCodeRule: QrCodeRule) => this.edit(qrCodeRule);
        editTableAction.isDisabled = () => false;
        editTableAction.isVisible = () => true;
        editTableAction.tooltip = () => this.translateService.instant('COMMON.TOOLTIP.EDIT');
        editTableAction.color = () => 'primary';

        this.tableActions.push(editTableAction);
    }

    add(): void {
        this.selectedRule = null;
        this.ruleDrawer.toggle();
    }

    edit(qrCodeRule: QrCodeRule): void {
        this.selectedRule = qrCodeRule;
        this.ruleDrawer.toggle();
    }
}
