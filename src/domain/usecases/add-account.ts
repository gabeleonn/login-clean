import { AccountModel } from '../entities/signup/account-model';

export interface AccountModelDTO {
  username: string;
  password: string;
}

export interface AddAccount {
  add: (newAccount: AccountModelDTO) => Promise<AccountModel>;
}
