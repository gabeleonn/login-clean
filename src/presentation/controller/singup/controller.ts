import { AddAccount } from '../../../domain';
import { MissingParamError } from '../../errors';
import { InvalidParamError } from '../../errors/invalid-param';
import { badRequest, serverError, success } from '../../helpers';
import { HttpRequest, HttpResponse, IController } from '../../protocols';

export class SignUpController implements IController {
  private readonly addAccount: AddAccount;

  constructor(addAccount: AddAccount) {
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      for (const field of ['username', 'password', 'passwordConfirmation']) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { username, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const account = await this.addAccount.add({ username, password });
      if (account) {
        return success(account);
      }
      return badRequest(new InvalidParamError('username'));
    } catch (error) {
      return serverError(error);
    }
  }
}
