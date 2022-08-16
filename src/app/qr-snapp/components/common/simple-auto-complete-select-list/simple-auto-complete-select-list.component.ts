import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ValueDataPair} from '../../../models/ui/valueDataPair';

@Component({
    selector: 'app-simple-auto-complete-select-list',
    templateUrl: './simple-auto-complete-select-list.component.html',
    styleUrls: ['./simple-auto-complete-select-list.component.css']
})
export class SimpleAutoCompleteSelectListComponent implements OnInit {

    constructor() {
        this.valueDataPairs = [];
    }

    @Input() readOnly: boolean;
    @Input() forceMatch: boolean;
    @Input() required: boolean;
    @Input() placeholder: string;
    @Input() errorMessage: string;
    @Input() set values(vp: ValueDataPair[]) {
        if (vp && vp.length > 0) {
            this.valueDataPairs = vp;
            this.selectValue(this.firstValue);
        }
    }

    @Input() set startValue(startValue: any){
        this.firstValue = startValue;
        if (this.valueDataPairs && this.valueDataPairs.length > 0) {
            this.selectValue(startValue);
        }
    }

    @Output() itemSelected = new EventEmitter<any>();
    @Output() noItemSelected = new EventEmitter<void>();

    firstValue: any;
    valuesObservable: Observable<ValueDataPair[]>;
    formControl = new FormControl();
    selected: ValueDataPair;
    valid: boolean;
    valueDataPairs: ValueDataPair[];

    ngOnInit(): void {
        if (this.readOnly) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }

        this.valuesObservable = this.formControl.valueChanges
            .pipe(
                startWith(''),
                map(val => this.filter(val))
            );

        this.valuesObservable.subscribe(rwb => {
            if (rwb.length === 1) {
                this.itemSelected.emit(rwb[0].data);
                this.selected = rwb[0];
                this.valid = true;
            } else {
                this.noItemSelected.emit();
                this.selected = null;
                this.valid = !this.required || !this.forceMatch;
            }
        });

        this.selectValue(this.firstValue);
    }

    selectValue(newValue: any){
        if (newValue) {
            const index = this.valueDataPairs.findIndex(value => value.data === newValue);
            if (index !== -1) {
                this.formControl.setValue(this.valueDataPairs[index].value);
            }
        }
    }

    autoComplete(): void {
        if (this.selected !== null && this.formControl.value !== this.selected.value) {
            this.formControl.setValue(this.selected.value);
        } else if (this.selected === null && this.forceMatch) {
            setTimeout(() => { // delay this as focus out event can happen also is user clicks on the dowpdown
                if (this.selected === null) {
                    this.formControl.setValue('');
                }
            }, 100);
        }
    }

    filter(val: string): ValueDataPair[] {
        val = val.toLowerCase();

        const out = [];

        for (const d of this.valueDataPairs) {
            if (d.value.toLowerCase().indexOf(val) === 0) {
                out.push(d);
            }
        }

        return out;
    }
}
