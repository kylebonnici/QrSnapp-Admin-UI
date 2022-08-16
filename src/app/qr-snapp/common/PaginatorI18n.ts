
import { TranslateService } from '@ngx-translate/core';
import {MatPaginatorIntl} from '@angular/material/paginator';

export class PaginatorI18n {

    constructor(private readonly translate: TranslateService) {}

    getPaginatorIntl(): MatPaginatorIntl {
        const paginatorIntl = new MatPaginatorIntl();
        paginatorIntl.itemsPerPageLabel = this.translate.instant('COMMON.PAGINATOR.LABEL.ITEMS_PER_PAGE');
        paginatorIntl.nextPageLabel = this.translate.instant('COMMON.PAGINATOR.LABEL.NEXT_PAGE');
        paginatorIntl.previousPageLabel = this.translate.instant('COMMON.PAGINATOR.LABEL.PREVIOUS_PAGE');
        paginatorIntl.firstPageLabel = this.translate.instant('COMMON.PAGINATOR.LABEL.FIRST_PAGE');
        paginatorIntl.lastPageLabel = this.translate.instant('COMMON.PAGINATOR.LABEL.LAST_PAGE');
        paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
        return paginatorIntl;
    }

    private getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0 || pageSize === 0) {
            return this.translate.instant('COMMON.PAGINATOR.LABEL.RANGE_PAGE_1', { length });
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return this.translate.instant('COMMON.PAGINATOR.LABEL.RANGE_PAGE_2', { startIndex: startIndex + 1, endIndex, length });
    }
}
