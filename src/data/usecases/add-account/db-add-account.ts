import { AccountModel, AccountModelDTO, AddAccount } from '../../../domain';
import { IAddAccountRepository, IUserExistsRepository } from '../../protocols';
import { IEncrypter } from '../../protocols/security/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly userExistsRepository: IUserExistsRepository;
  private readonly encrypter: IEncrypter;
  private readonly addAccountRepository: IAddAccountRepository;

  constructor(
    userExistsRepository: IUserExistsRepository,
    encrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository,
  ) {
    this.userExistsRepository = userExistsRepository;
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(newAccount: AccountModelDTO): Promise<AccountModel> {
    const userExists = await this.userExistsRepository.exists(newAccount.username);
    if (userExists) {
      return null;
    }
    newAccount.password = await this.encrypter.hash(newAccount.password);
    const account = await this.addAccountRepository.add(newAccount);
    return account;
  }
}
