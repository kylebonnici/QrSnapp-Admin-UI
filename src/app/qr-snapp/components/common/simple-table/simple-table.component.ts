import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {SelectionModel} from '@angular/cdk/collections';
import {TableColumnDefinition} from '../../../models/ui/tableColumnDefinition';
import {TableActions} from '../../../models/ui/tableActions';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
    selector: 'app-simple-table',
    templateUrl: './simple-table.component.html',
    styleUrls: ['./simple-table.component.css']
})
export class SimpleTableComponent<T> implements OnInit {

    constructor() {}
    @Input() displayColumns: string[];
    @Input() progressBarMode: ProgressBarMode;
    @Input() tableColumnDefinitions: TableColumnDefinition<T>[];
    @Input() pageTranslationID: string;
    @Input() tableActions: TableActions<T>[];
    @Input() selection = new SelectionModel<T>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSourceObj: MatTableDataSource<T>;

    @Input() set dataSource(dataSource: MatTableDataSource<T>){
        this.dataSourceObj = dataSource;
        this.dataSourceObj.sort = this.sort;
        this.dataSourceObj.paginator = this.paginator;
    }

    ngOnInit(): void {
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: T): string {
        if (!row) {
            return '${this.isAllSelected() ? \'select\' : \'deselect\'} all';
        }
        return '${this.selection.isSelected(row) ? \'deselect\' : \'select\'} row ${row.position + 1}';
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSourceObj.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSourceObj.data.forEach(row => this.selection.select(row));
    }
}
