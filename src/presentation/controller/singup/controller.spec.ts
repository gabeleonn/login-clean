import { AccountModelDTO, AddAccount, AccountModel } from '../../../domain';
import { MissingParamError } from '../../errors';
import { InvalidParamError } from '../../errors/invalid-param';
import { badRequest, serverError, success } from '../../helpers';
import { HttpRequest } from '../../protocols';
import { SignUpController } from './controller';

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(newAccount: AccountModelDTO): Promise<AccountModel> {
      return await new Promise(resolve => resolve(null));
    }
  }
  return new AddAccountStub();
};

const makeRequest = (): HttpRequest => ({
  body: {
    username: 'any_username',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub();
  const sut = new SignUpController(addAccountStub);
  return {
    sut,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  test('When calling handle if no username should return MissingParamError.', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { password: 'any_password', passwordConfirmation: 'any_password' } });
    expect(response).toEqual(badRequest(new MissingParamError('username')));
  });

  test('When calling handle if no password should return MissingParamError.', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { username: 'any_username', passwordConfirmation: 'any_password' } });
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  test('When calling handle if no passwordConfirmation should return MissingParamError.', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { username: 'any_username', password: 'any_password' } });
    expect(response).toEqual(badRequest(new MissingParamError('passwordConfirmation')));
  });

  test('When calling handle if passwordConfirmation != password should return InvalidParamError.', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      body: { username: 'any_username', password: 'any_password', passwordConfirmation: 'wrong_password' },
    });
    expect(response).toEqual(badRequest(new InvalidParamError('passwordConfirmation')));
  });

  test('When calling handle if username exists should return InvalidParamError.', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)));
    const response = await sut.handle({
      body: { username: 'any_username', password: 'any_password', passwordConfirmation: 'any_password' },
    });
    expect(response).toEqual(badRequest(new InvalidParamError('username')));
  });

  test('When calling handle if no validation error should call SignUpUsecase with right values.', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    await sut.handle(makeRequest());
    expect(addSpy).toHaveBeenCalledWith({ username: 'any_username', password: 'any_password' });
  });

  test('When calling handle if no validation error should return the account.', async () => {
    const { sut, addAccountStub } = makeSut();
    const mockedResponse: AccountModel = { id: 'any_id', username: 'any_username', password: 'any_password' };
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(mockedResponse)));
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(success(mockedResponse));
  });

  test('When calling handle must return 500 if AddAccount throws.', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(serverError(new Error()));
  });
});
