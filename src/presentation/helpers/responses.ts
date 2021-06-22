import { HttpResponse } from '../protocols';

export const badRequest = (error: any): HttpResponse => ({
  status: 400,
  data: error,
});

export const success = (data: any): HttpResponse => ({
  status: 200,
  data,
});
