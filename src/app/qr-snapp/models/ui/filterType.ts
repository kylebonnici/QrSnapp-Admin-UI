export class FilterType<T> {
    code: string;
    predicate: (obj: T, value: string) => boolean;
    possibleValues: string[];
}
