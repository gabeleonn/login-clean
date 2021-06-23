import { AccountModelDTO, AccountModel } from '../../../../domain';

export interface IAddAccountRepository {
  add: (newAccount: AccountModelDTO) => Promise<AccountModel>;
}
