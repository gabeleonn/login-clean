import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

const makeAccountRepository = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('Add Account', () => {
    test('Should return an account on success', async () => {
      const sut = makeAccountRepository();

      const newAccount = { username: 'any_username', password: 'hashed_password' };
      const account = await sut.add(newAccount);

      expect(account).not.toBeNaN();
      expect(account.id).toBeTruthy();
      expect(account.password).toBe('hashed_password');
      expect(account.username).toBe('any_username');
    });
  });

  describe('Username Exists', () => {
    test('Should return false if user does not exists', async () => {
      const sut = makeAccountRepository();

      const username = 'any_username';
      const result = await sut.exists(username);
      expect(result).toBe(false);
    });

    test('Should return true if user does exists', async () => {
      const sut = makeAccountRepository();
      const newAccount = { username: 'any_username', password: 'hashed_password' };
      await sut.add(newAccount);

      const username = 'any_username';
      const result = await sut.exists(username);
      expect(result).toBe(true);
    });
  });
});
