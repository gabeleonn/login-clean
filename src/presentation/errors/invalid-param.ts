export class InvalidParamError extends Error {
  constructor(field: string) {
    const message = `O campo ${field} está incorreto.`;
    super(message);
    this.name = message;
  }
}
