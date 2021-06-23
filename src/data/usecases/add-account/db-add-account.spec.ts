import { AccountModel, AccountModelDTO } from '../../../domain';
import { IAddAccountRepository, IUserExistsRepository } from '../../protocols';
import { IEncrypter } from '../../protocols/security/encrypter';
import { DbAddAccount } from './db-add-account';

const makeUserExistsRepository = (): IUserExistsRepository => {
  class UsernameExistsRepositoryStub implements IUserExistsRepository {
    async exists(username: string): Promise<boolean> {
      return await new Promise(resolve => resolve(false));
    }
  }

  return new UsernameExistsRepositoryStub();
};

const makeEncrypter = (): IEncrypter => {
  class Encrypter implements IEncrypter {
    async hash(password: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new Encrypter();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(newAccount: AccountModelDTO): Promise<AccountModel> {
      return await new Promise(resolve =>
        resolve({ id: 'any_id', password: 'hashed_password', username: 'any_username' }),
      );
    }
  }

  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  usernmaeExistsRepositoryStub: IUserExistsRepository;
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeSut = (): SutTypes => {
  const usernmaeExistsRepositoryStub = makeUserExistsRepository();
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(usernmaeExistsRepositoryStub, encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    usernmaeExistsRepositoryStub,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe('DbAddAccount usecase', () => {
  test('When calling add should call UsernameExistsRepository.', async () => {
    const { sut, usernmaeExistsRepositoryStub } = makeSut();
    const existsSpy = jest.spyOn(usernmaeExistsRepositoryStub, 'exists');

    const username = 'any_username';
    const password = 'any_password';
    await sut.add({ username, password });

    expect(existsSpy).toHaveBeenCalledWith(username);
  });

  test('When calling add if user exists should return null', async () => {
    const { sut, usernmaeExistsRepositoryStub } = makeSut();
    jest.spyOn(usernmaeExistsRepositoryStub, 'exists').mockResolvedValueOnce(true);

    const username = 'any_username';
    const password = 'any_password';
    const result = await sut.add({ username, password });

    expect(result).toBeNull();
  });

  test('When calling add if repo throws it should throw.', async () => {
    const { sut, usernmaeExistsRepositoryStub } = makeSut();
    jest.spyOn(usernmaeExistsRepositoryStub, 'exists').mockImplementationOnce(() => {
      throw new Error();
    });

    const username = 'any_username';
    const password = 'any_password';
    const promise = sut.add({ username, password });

    await expect(promise).rejects.toThrow();
  });

  test('When calling add should call Encrypter.', async () => {
    const { sut, encrypterStub } = makeSut();
    const hasherSpy = jest.spyOn(encrypterStub, 'hash');

    const username = 'any_username';
    const password = 'any_password';
    await sut.add({ username, password });

    expect(hasherSpy).toHaveBeenCalledWith(password);
  });

  test('When calling add if repo throws it should throw.', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const username = 'any_username';
    const password = 'any_password';
    const promise = sut.add({ username, password });

    await expect(promise).rejects.toThrow();
  });

  test('When calling add should call AddAccountRepository.', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const username = 'any_username';
    const password = 'any_password';
    await sut.add({ username, password });

    expect(addSpy).toHaveBeenCalledWith({ username, password: 'hashed_password' });
  });

  test('When calling add if repo throws it should throw.', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const username = 'any_username';
    const password = 'any_password';
    const promise = sut.add({ username, password });

    await expect(promise).rejects.toThrow();
  });

  test('When calling add if everything is fine should return a new Account.', async () => {
    const { sut } = makeSut();
    const username = 'any_username';
    const password = 'any_password';
    const account = await sut.add({ username, password });

    await expect(account).toEqual({ id: 'any_id', password: 'hashed_password', username: 'any_username' });
  });
});
