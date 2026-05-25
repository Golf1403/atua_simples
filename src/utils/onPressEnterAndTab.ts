const onPressEnterAndTab = async (event: React.KeyboardEvent, nextInputId: string) => {
  event.persist();
  const target: any = event?.target;
  const form = target?.form;
  if (form)
    if (event.keyCode === 9 || event.keyCode === 13) {
      event.preventDefault();
      const nextElement = form.elements[nextInputId];
      if (target?.blur) await target?.blur();
      if (nextElement?.focus) nextElement?.focus();
    }
};

export { onPressEnterAndTab };
