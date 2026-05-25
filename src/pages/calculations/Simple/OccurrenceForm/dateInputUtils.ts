import { FocusEvent } from 'react';

export const formatDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join('/');
};

export const selectInputValue = (event: FocusEvent<HTMLInputElement>): void => {
  const input = event.currentTarget;
  window.requestAnimationFrame(() => input.select());
};
