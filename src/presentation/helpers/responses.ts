import { HttpResponse } from '../protocols';

export const badRequest = (error: any): HttpResponse => ({
  status: 400,
  data: error,
});
