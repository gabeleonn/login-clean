import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;

const makeBcryptAdapter = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise(resolve => resolve('hash'));
  },
}));

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with password and salt', async () => {
    const sut = makeBcryptAdapter();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('password');
    expect(hashSpy).toBeCalledWith('password', salt);
  });

  test('If all good should return the hashed pass', async () => {
    const sut = makeBcryptAdapter();
    const hashedPass = await sut.hash('password');
    expect(hashedPass).toBe('hash');
  });
});
