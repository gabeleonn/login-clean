import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers';
import { HttpRequest, HttpResponse, IController } from '../../protocols';

export class SignUpController implements IController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    for (const field of ['username', 'password', 'passwordConfirmation']) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return await new Promise(resolve => resolve(null));
  }
}
