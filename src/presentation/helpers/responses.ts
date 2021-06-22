import { HttpResponse } from '../protocols';

export const badRequest = (error: Error): HttpResponse => ({
  status: 400,
  data: error,
});

export const success = (data: any): HttpResponse => ({
  status: 200,
  data,
});

export const serverError = (error: Error): HttpResponse => ({
  status: 500,
  data: error,
});
