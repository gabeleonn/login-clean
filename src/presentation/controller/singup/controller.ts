import { MissingParamError } from '../../errors';
import { InvalidParamError } from '../../errors/invalid-param';
import { badRequest } from '../../helpers';
import { HttpRequest, HttpResponse, IController } from '../../protocols';

export class SignUpController implements IController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    for (const field of ['username', 'password', 'passwordConfirmation']) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    const { password, passwordConfirmation } = httpRequest.body;
    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamError('passwordConfirmation'));
    }
    return await new Promise(resolve => resolve(null));
  }
}
