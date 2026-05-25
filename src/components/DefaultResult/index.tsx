import React from 'react';

import Title from '@components/Title';
import { Container, HorizontalLine } from './styles';
import NumberCounter from '../NumberCounter';
import { TitleContainer } from '@/styles/global';

export interface DefaultResultImp {
  currency?: string;
  result?: number | string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  suffix?: string;
}
const DefaultResult = ({
  currency,
  result = 0,
  title = 'Resultado',
  suffix,
  onClick,
}: DefaultResultImp): JSX.Element => {
  return (
    <Container>
      <TitleContainer>
        <Title onClick={onClick} title={title} />
      </TitleContainer>

      <HorizontalLine>
        {(() => {
          if (typeof result == 'number') {
            if (currency) return <NumberCounter currency={currency} payload={result} />;
            return <NumberCounter payload={result} />;
          }

          return (
            <label>
              {(() => {
                if (suffix) return `${result} ${suffix}`;
                if (currency) return `${currency} ${result}`;
                return result;
              })()}
            </label>
          );
        })()}
      </HorizontalLine>
    </Container>
  );
};

export default DefaultResult;
