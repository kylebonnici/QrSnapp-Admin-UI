export class TableActions<T>{
    matIcon: string;
    action: (data: T) => void;
    isDisabled: (data: T) => boolean;
    isVisible: (data: T) => boolean;
    tooltip: (data: T) => string;
    color: (data: T) => string;
}
