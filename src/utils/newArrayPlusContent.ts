export const newArrayPlusContent = (Array: any[], content: any) => {
  let findedIndex = null;
  const newArray = Array.map((_content, index) => {
    if (_content.id !== content.id) {
      return _content;
    } else {
      findedIndex = index;
      return _content;
    }
  });

  if (findedIndex !== null) {
    newArray[findedIndex] = { ...newArray[findedIndex], ...content };
  }

  return newArray;
};
