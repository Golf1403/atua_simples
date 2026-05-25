import { reorderItemsByIndex } from '@/lib/utils';

describe('reorderItemsByIndex', () => {
  const itemsWithOrder = (values: string[]) =>
    values.map((value, index) => ({ id: value, order: index + 1 }));

  it('moves item from start to end position', () => {
    const items = itemsWithOrder(['a', 'b', 'c', 'd']);
    const result = reorderItemsByIndex(items, 0, 3);

    expect(result.map((i: any) => i.id)).toEqual(['b', 'c', 'd', 'a']);
    expect(result.map((i: any) => i.order)).toEqual([1, 2, 3, 4]);
  });

  it('moves item backwards in the list', () => {
    const items = itemsWithOrder(['a', 'b', 'c', 'd']);
    const result = reorderItemsByIndex(items, 2, 0);

    expect(result.map((i: any) => i.id)).toEqual(['c', 'a', 'b', 'd']);
  });

  it('does not mutate the original array', () => {
    const items = itemsWithOrder(['a', 'b', 'c']);
    const original = [...items];
    reorderItemsByIndex(items, 0, 2);

    expect(items).toEqual(original);
  });

  it('returns items with correct sequential order values', () => {
    const items = [
      { id: 'x', order: 99 },
      { id: 'y', order: 99 },
      { id: 'z', order: 99 },
    ];
    const result = reorderItemsByIndex(items, 0, 1);

    expect(result.map((i: any) => i.order)).toEqual([1, 2, 3]);
  });

  it('handles same start and end index (no-op)', () => {
    const items = itemsWithOrder(['a', 'b']);
    const result = reorderItemsByIndex(items, 0, 0);

    expect(result.map((i: any) => i.id)).toEqual(['a', 'b']);
  });
});
