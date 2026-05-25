import ExpenseImp from '@interfaces/calculations/ExpenseImp';

export default class ExpenseTransformer {
  public static output(authorId: string, expense: ExpenseImp) {
    return {
      authorId,
      date: expense.date,
      description: expense.description,
      value: expense.value,
      article523: expense.article_523,
    };
  }
}
