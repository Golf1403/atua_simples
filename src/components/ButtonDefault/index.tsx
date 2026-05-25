import React, { Fragment } from 'react';

import ButtonImp from '@interfaces/ButtonImp';
import { ButtonDefault as Button } from '@/styles/global';
import DefaultTooltip, { DefaultTooltipImp } from '../DefaultTooltip';

const ButtonDefault = (props: ButtonImp & Omit<DefaultTooltipImp, 'children'>): JSX.Element => {
  const { disabled, handleOnClick, id, label, type, icon: Icon, ...tooltipProp } = props;

  const onClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (handleOnClick) {
      event.preventDefault();
      handleOnClick();
    }
  };

  return (
    <Button
      type={type}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => void onClick(event)}
      id={id}
      disabled={disabled}>
      {String(label).length ? (
        <DefaultTooltip {...tooltipProp} text={String(label)}>
          <Fragment>{Icon ? <Icon /> : label}</Fragment>
        </DefaultTooltip>
      ) : (
        <Fragment>{Icon ? <Icon /> : label}</Fragment>
      )}
    </Button>
  );
};

export default ButtonDefault;
