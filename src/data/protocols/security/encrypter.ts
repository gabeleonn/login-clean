export interface IEncrypter {
  hash: (password: string) => Promise<string>;
}
