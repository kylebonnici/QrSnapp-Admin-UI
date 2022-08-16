import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FilterType} from '../../../models/ui/filterType';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Filter} from '../../../models/ui/filter';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';
@Component({
    selector: 'app-chip-table-filter',
    templateUrl: './chip-table-filter.component.html',
    styleUrls: ['./chip-table-filter.component.css']
})
export class ChipTableFilterComponent<T> implements OnInit {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor() {
    }

    @ViewChild('filterInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    filterInputCtrl = new FormControl();
    @Input() pageTranslationID: string;
    autoSelectOptions: string[];
    selectedFilterType: FilterType<T>;
    @Input() filterTypes: FilterType<T>[];
    @Input() filters: Filter[];
    @Output() filterChangedEvent = new EventEmitter<void>();

    removeFilter(filter: Filter) {
        let index = this.filters.indexOf(filter);
        this.filters.splice(index, 1);

        index = this.selectedFilterType.possibleValues.indexOf(filter.value);
        if (index !== -1) {
            this.autoSelectOptions.unshift(filter.value);
        }

        this.filterChangedEvent.emit();
    }

    addFilter(event: MatChipInputEvent): void {
        const value = event.value;

        if ((value || '').trim()) {
            const filter = new Filter();
            filter.value = event.value.trim();
            filter.filterType = this.selectedFilterType.code;
            this.filters.push(filter);
        }

        const input = event.input;

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.filterChangedEvent.emit();
    }

    onChangeSelectedFilterType(filterType: FilterType<T>) {
        this.selectedFilterType = filterType;

        const filterPossibleValues = this.selectedFilterType.possibleValues;

        if (filterPossibleValues === undefined) {
            this.selectedFilterType.possibleValues = [];
        }

        this.autoSelectOptions = Object.assign([], filterPossibleValues);

        for (const f of this.filters) {
            if (f.filterType === this.selectedFilterType.code) {
                const index = this.autoSelectOptions.indexOf(f.value);
                if (index > -1) {
                    this.autoSelectOptions.splice(index, 1);
                }
            }
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const filter = new Filter();
        filter.value = event.option.viewValue.trim();
        filter.filterType = this.selectedFilterType.code;
        this.filters.push(filter);
        this.fruitInput.nativeElement.value = '';
        this.filterInputCtrl.setValue(null);

        const index = this.autoSelectOptions.indexOf(filter.value);
        if (index > -1) {
            this.autoSelectOptions.splice(index, 1);
        }

        this.filterChangedEvent.emit();
    }

    ngOnInit(): void {
    }
}
