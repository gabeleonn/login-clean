import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers';
import { SignUpController } from './controller';

describe('SignUp Controller', () => {
  test('When calling handle should if no username should return MissingParamError.', async () => {
    const sut = new SignUpController();
    const response = await sut.handle({ body: { password: 'any_password', passwordConfirmation: 'any_password' } });
    expect(response).toEqual(badRequest(new MissingParamError('username')));
  });

  test('When calling handle should if no password should return MissingParamError.', async () => {
    const sut = new SignUpController();
    const response = await sut.handle({ body: { username: 'any_username', passwordConfirmation: 'any_password' } });
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  test('When calling handle should if no passwordConfirmation should return MissingParamError.', async () => {
    const sut = new SignUpController();
    const response = await sut.handle({ body: { username: 'any_username', password: 'any_password' } });
    expect(response).toEqual(badRequest(new MissingParamError('passwordConfirmation')));
  });
});
