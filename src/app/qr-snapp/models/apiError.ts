export class ApiError {
    description: string;
    code: ApiErrorCode;
    metaData: Map<string, any>;
}

export enum ApiErrorCode {
    NOT_LOGGED_IN = 'NOT_LOGGED_IN',
    CONSTRAIN_VIOLATION = 'CONSTRAIN_VIOLATION',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
    DUPLICATE_USERNAME = 'DUPLICATE_USERNAME',
    CHANGE_OWN_ROLES = 'CHANGE_OWN_ROLES',
    DELETE_OWN_USER = 'DELETE_OWN_USER',
    CHANGE_OWN_ACCOUNT_STATE = 'CHANGE_OWN_ACCOUNT_STATE',
    CHANGE_OWN_ACTIVE_DATES = 'CHANGE_OWN_ACTIVE_DATES',
    ACCOUNT_ALREADY_ACTIVE = 'ACCOUNT_ALREADY_ACTIVE',
    INVALID_ACCOUNT_STATE_CHANGE = 'INVALID_ACCOUNT_STATE_CHANGE',
    PASSWORD_NOT_SECURE = 'PASSWORD_NOT_SECURE',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
    INVALID_TOKEN_TYPE = 'INVALID_TOKEN_TYPE',
    EXPIRED_TOKEN = 'EXPIRED_TOKEN',
    NOT_FOUND = 'NOT_FOUND',
    NO_SUBSCRIPTION = 'NO_SUBSCRIPTION',
    UNPAID_SUBSCRIPTION = 'UNPAID_SUBSCRIPTION',
    INDEX_ALREADY_IN_USE = 'INDEX_ALREADY_IN_USE',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
