export class User {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  accountState: AccountState;
  validFrom: Date;
  validTo: Date;
}

export enum AccountState {
  PENDING_ACTIVATION = 'PENDING_ACTIVATION',
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  DISABLED = 'DISABLED',
  PENDING_PASSWORD = 'PENDING_PASSWORD'
}
