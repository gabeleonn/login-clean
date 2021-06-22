export class MissingParamError extends Error {
  constructor(field: string) {
    const message = `O campo ${field} está faltando.`;
    super(message);
    this.name = message;
  }
}
