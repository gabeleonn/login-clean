import { DbAddAccount } from '../../data/usecases';
import { AccountMongoRepository } from '../../infra/db/mongodb/account/account-mongo-repository';
import { IController, SignUpController } from '../../presentation';
import { BcryptAdapter } from '../../utils/bcrypt/bcrypt-adapter';

export const makeSignUpController = (): IController => {
  const bcryptAdapter = new BcryptAdapter(12);
  const accountMongoRepository = new AccountMongoRepository();
  const addAccountUseCase = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository);
  return new SignUpController(addAccountUseCase);
};
