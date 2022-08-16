import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {QrSnappComponent} from './qr-snapp.component';
import {UsersComponent} from './components/users/users/users.component';
import {UserComponent} from './components/users/user/user.component';
import {AccountComponent} from './components/settings/account/account.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {DeleteConfirmDialogComponent} from './components/common/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ErrorDialogComponent} from './components/common/error-dialog/error-dialog.component';
import {NumberInputDialogComponent} from './components/common/number-input-dialog/number-input-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserAddEditDialogComponent} from './components/users/user-add-edit-dialog/user-add-edit-dialog.component';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChangeUserPasswordDialogComponent} from './components/users/change-user-password-dialog/change-user-password-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ChangeAccountPasswordDialogComponent} from './components/settings/change-account-password-dialog/change-account-password-dialog.component';
import {RoleService} from './services/role.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {UserService} from './services/user.service';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {BaseDataControllerComponent} from './components/common/base-data-controller/base-data-controller.component';
import {ChipTableFilterComponent} from './components/common/chip-table-filter/chip-table-filter.component';
import {MatBadgeModule} from '@angular/material/badge';
import {SimpleTableComponent} from './components/common/simple-table/simple-table.component';
import {TranslateModule} from '@ngx-translate/core';
import {SimpleAutoCompleteSelectListComponent} from './components/common/simple-auto-complete-select-list/simple-auto-complete-select-list.component';
import {DashboardComponent} from './components/common/dashboard/dashboard.component';
import {GroupsComponent} from './components/groups/groups.component';
import { StringInputDialogComponent } from './components/common/string-input-dialog/string-input-dialog.component';
import { QRCodesComponent } from './components/qrcodes/qrcodes/qrcodes.component';
import { QrCodeAddEditDialogComponent } from './components/qrcodes/qrcode-add-edit-dialog/qr-code-add-edit-dialog.component';
import { RulesComponent } from './components/qrcodes/rules/rules/rules.component';
import { RuleComponent } from './components/qrcodes/rules/rule/rule.component';
import {QRCodeModule} from 'angularx-qrcode';
import { QrCodeDialogComponent } from './components/common/qr-code-dialog/qr-code-dialog.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions/subscriptions.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

const routes: Routes = [
    {
        path: '', component: QrSnappComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'users', component: UsersComponent},
            {path: 'users/details', component: UserComponent},
            {path: 'settings/account', component: AccountComponent},
            {path: 'groups', component: GroupsComponent},
            {path: 'groups/:groupId/qrcodes', component: QRCodesComponent},
            {path: 'groups/:groupId/qrcodes/:qrCodesId/rules', component: RulesComponent},
            {path: 'groups/:groupId/qrcodes/:qrCodesId/rules/:ruleId', component: RuleComponent},
            {path: 'subscriptions', component: SubscriptionsComponent},
        ]
    }
];

@NgModule({
    declarations: [
        QrSnappComponent,
        SidenavComponent,
        ToolbarComponent,
        UsersComponent,
        UserComponent,
        UserAddEditDialogComponent,
        ChangeUserPasswordDialogComponent,
        AccountComponent,
        DeleteConfirmDialogComponent,
        ErrorDialogComponent,
        NumberInputDialogComponent,
        ChangeAccountPasswordDialogComponent,
        BaseDataControllerComponent,
        ChipTableFilterComponent,
        SimpleTableComponent,
        SimpleAutoCompleteSelectListComponent,
        DashboardComponent,
        GroupsComponent,
        StringInputDialogComponent,
        QRCodesComponent,
        QrCodeAddEditDialogComponent,
        RulesComponent,
        RuleComponent,
        QrCodeDialogComponent,
        SubscriptionsComponent,
    ],
    providers: [
        RoleService,
        UserService
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        MatIconModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogModule,
        MatNativeDateModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatMenuModule,
        MatCardModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatSortModule,
        MatChipsModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatSelectModule,
        MatBadgeModule,
        TranslateModule,
        QRCodeModule,
        MatSlideToggleModule
    ]
})
export class QrSnappModule {
}
