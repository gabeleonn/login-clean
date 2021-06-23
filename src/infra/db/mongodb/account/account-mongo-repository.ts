import { IAddAccountRepository } from '../../../../data/protocols';
import { AccountModel, AccountModelDTO } from '../../../../domain';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements IAddAccountRepository {
  async add(newAccount: AccountModelDTO): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(newAccount);
    return MongoHelper.map(result.ops[0]);
  }
}
