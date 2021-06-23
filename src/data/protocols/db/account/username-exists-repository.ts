export interface IUserExistsRepository {
  exists: (username: string) => Promise<boolean>;
}
