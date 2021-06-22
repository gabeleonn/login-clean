import { AddAccount } from '../../../domain';
import { MissingParamError } from '../../errors';
import { InvalidParamError } from '../../errors/invalid-param';
import { badRequest } from '../../helpers';
import { HttpRequest, HttpResponse, IController } from '../../protocols';

export class SignUpController implements IController {
  private readonly addAccount: AddAccount;

  constructor(addAccount: AddAccount) {
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    for (const field of ['username', 'password', 'passwordConfirmation']) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    const { username, password, passwordConfirmation } = httpRequest.body;
    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamError('passwordConfirmation'));
    }
    await this.addAccount.add({ username, password });
    return await new Promise(resolve => resolve(null));
  }
}
