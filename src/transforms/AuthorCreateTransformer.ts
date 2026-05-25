import SimpleAuthorImp from '@interfaces/calculations/SimpleAuthorImp';

export default class AuthorTransformer {
  public static output(accountId: string, author: SimpleAuthorImp) {
    return {
      accountId,
      name: author.name,
    };
  }
}
