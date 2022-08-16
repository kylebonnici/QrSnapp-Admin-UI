import {Component} from '@angular/core';
import {BaseDataControllerComponent} from '../common/base-data-controller/base-data-controller.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {TableColumnDefinition} from '../../models/ui/tableColumnDefinition';
import {FilterType} from '../../models/ui/filterType';
import {TableActions} from '../../models/ui/tableActions';
import {Group} from '../../models/backend/group';
import {StringInputDialogComponent} from '../common/string-input-dialog/string-input-dialog.component';
import {GroupService} from '../../services/group.service';


@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent extends BaseDataControllerComponent<Group> {

    constructor(protected dialog: MatDialog,
                public groupService: GroupService,
                private authenticationService: AuthenticationService,
                private router: Router,
                protected translateService: TranslateService) {
        super(groupService, dialog, translateService);
        this.hasSelection = true;
        this.hasActions = true;

        this.prepareFilters();
        this.prepareTableColumnDefinitions();
        this.prepareTableRowActions();
    }

    pageTranslationID = 'GROUPS.';

    private prepareTableColumnDefinitions(): void {
        const nameTableColumnDefinition = new TableColumnDefinition();
        nameTableColumnDefinition.code = 'name';
        nameTableColumnDefinition.getData = (group: Group): string => group.name;

        this.tableColumnDefinitions.push(nameTableColumnDefinition);
    }

    private prepareFilters(): void {
        const fullNameFilter = new FilterType<Group>();
        fullNameFilter.code = 'Name';
        fullNameFilter.predicate = (group: Group, f): boolean => {
            return group.name.startsWith(f);
        };

        this.filterTypes.push(fullNameFilter);
    }

    private prepareTableRowActions(): void {
        const editTableAction = new TableActions<Group>();
        editTableAction.matIcon = 'edit';
        editTableAction.action = (group: Group) => this.edit(group);
        editTableAction.isDisabled = () => false;
        editTableAction.isVisible = () => true;
        editTableAction.tooltip = () => this.translateService.instant('COMMON.TOOLTIP.EDIT');
        editTableAction.color = () => 'primary';

        this.tableActions.push(editTableAction);

        const viewQrCodeTableAction = new TableActions<Group>();
        viewQrCodeTableAction.matIcon = 'qr_code';
        viewQrCodeTableAction.action = (group: Group) => this.details(group);
        viewQrCodeTableAction.isDisabled = () => false;
        viewQrCodeTableAction.isVisible = () => true;
        viewQrCodeTableAction.tooltip = () =>  this.translateService.instant('GROUPS.TOOLTIP.MANAGE_QRCODES');
        viewQrCodeTableAction.color = () => 'primary';

        this.tableActions.push(viewQrCodeTableAction);
    }

    add(): void {
        this.dialog.open(StringInputDialogComponent, {
            data: {
                title: this.pageTranslationID + 'LABEL.NEW_GROUP',
                placeholder: this.pageTranslationID + 'LABEL.NAME',
                value: ''
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                const grp = new Group();
                grp.name = result;
                this.groupService.add(grp);
            }
        });
    }

    edit(group: Group): void {
        this.dialog.open(StringInputDialogComponent, {
            data: {
                value: group.name,
                placeholder: this.pageTranslationID + 'LABEL.NAME',
                title:  this.pageTranslationID + 'LABEL.EDIT_GROUP',
                bEdit: true
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                const grp = Object.assign({}, group);
                grp.name = result;
                this.groupService.edit(group, grp, group.id);
            }
        });
    }

    details(group: Group): void {
        this.router.navigate(['/profile/' + this.authenticationService.getCurrentProfile() + '/groups/' + group.id + '/qrcodes']);
    }
}
