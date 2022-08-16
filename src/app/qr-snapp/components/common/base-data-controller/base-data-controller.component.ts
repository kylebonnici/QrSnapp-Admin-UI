import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BaseDataStoreService} from '../../../services/base-data-store.service';
import {MatTableDataSource} from '@angular/material/table';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {Filter} from '../../../models/ui/filter';
import {FilterType} from '../../../models/ui/filterType';
import {TableColumnDefinition} from '../../../models/ui/tableColumnDefinition';
import {SelectionModel} from '@angular/cdk/collections';
import {DeleteConfirmDialogComponent} from '../delete-confirm-dialog/delete-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TableActions} from '../../../models/ui/tableActions';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-base-data-controller',
    template: ``,
    styleUrls: ['./base-data-controller.component.css']
})
export class BaseDataControllerComponent<T> implements OnInit, OnDestroy {
    dataSource: MatTableDataSource<T>;
    localData: Observable<T[]>;
    subscription: Subscription;
    filters: Filter[];
    filterTypes: FilterType<T>[];
    tableColumnDefinitions: TableColumnDefinition<T>[];
    tableActions: TableActions<T>[];
    hasSelection: boolean;
    hasActions: boolean;
    loadAllOnLoad: boolean;
    selection = new SelectionModel<T>(true, []);

    constructor(private baseDataStoreService: BaseDataStoreService<T>,
                protected dialog: MatDialog,
                protected translateService: TranslateService) {
        this.filters = [];
        this.filterTypes = [];
        this.tableColumnDefinitions = [];
        this.tableActions = [];
        this.loadAllOnLoad = false;
        this.localData = this.baseDataStoreService.observable;
    }

    ngOnInit(): void {
        this.subscription = this.localData.subscribe(data => {
            this.dataSource = new MatTableDataSource<T>(data);
            this.dataSource.filterPredicate = ((d, f) => {
                const filters = JSON.parse(f) as Filter[];

                for (const filter of filters) {
                    const index = this.filterTypes.findIndex(filterType => filterType.code === filter.filterType);

                    if (this.filterTypes[index].predicate(d, filter.value)) {
                        return true;
                    }
                }

                return filters.length === 0;
            });

            this.applyFilter();
        });

        if (this.loadAllOnLoad) {
            this.reload();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload(): void {
        this.baseDataStoreService.getAll();
    }

    delete(): void {
        const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
            data:  'COMMON.LABEL.DELETE_CONFIRMATION'
        });

        const subscription = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                for (const selected of this.selection.selected) {
                    this.baseDataStoreService.delete(selected);
                }
            }

            subscription.unsubscribe();
        });
    }

    applyFilter(): void {
        this.dataSource.filter = JSON.stringify(this.filters);
    }

    getProgressBarMode(): ProgressBarMode {
        return this.baseDataStoreService.isQueryInProgress() ? 'query' : 'determinate';
    }

    getDisplayColumns(): string[] {
        const out = [];

        if (this.hasSelection) {
            out.push('select');
        }

        for (const tableColumnDefinition of this.tableColumnDefinitions) {
            out.push(tableColumnDefinition.code);
        }

        if (this.hasActions) {
            out.push('actions');
        }

        return out;
    }
}
