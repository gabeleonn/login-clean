import { IController, HttpRequest } from '../../presentation/protocols';
import { Request, Response } from 'express';

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.status === 200) {
      res.status(httpResponse.status).json(httpResponse.data);
    } else {
      res.status(httpResponse.status).json({
        error: httpResponse.data.message,
      });
    }
  };
};
