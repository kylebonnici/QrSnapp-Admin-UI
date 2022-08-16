export class TableColumnDefinition<T> {
    code: string;
    getData: (obj: T) => string | number;
}
