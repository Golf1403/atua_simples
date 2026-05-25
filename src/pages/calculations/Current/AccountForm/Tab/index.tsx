import React, { Fragment } from 'react';

import Title from '@components/Title';
import NumberCounter from '../../../../../components/NumberCounter';
import {
  ChildrenContainer,
  Container,
  Header,
  HeaderContainer,
  HorizontalLine,
  NumberContainer,
  ResultContainer,
  ResultInfoContainer,
  ResultTitleContainer,
  TitleContainer,
} from './styles';
import { IconType } from 'react-icons';
import { IoMdHelp } from 'react-icons/io';
import DefaultTooltip from '@/components/DefaultTooltip';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';

export interface TabImp {
  currency?: string;
  result?: number | string;
  title?: string;
  resultTitle?: string;
  Icon?: IconType;
  children: React.ReactChild;
  ResultIcon?: IconType;
  toggle?: (payload?: boolean) => void;
  onClick?: () => void;
  visible: boolean;
  isAuthor?: boolean;
  helpText?: string;
  helpLink?: string;
  authors?: CurrentAuthorImp[];
  helpMinWidth?: string;
  updateTo?: string;
}
const Tab = ({
  currency,
  result,
  resultTitle = 'Total',
  title = 'Resultado',
  children,
  visible,
  Icon,
  ResultIcon,
  toggle,
  authors,
  onClick,
  isAuthor,
  helpText,
  helpLink,
  helpMinWidth,
  updateTo,
}: TabImp): JSX.Element => {
  return (
    <Container $visibility={visible}>
      <HeaderContainer>
        <Header>
          <TitleContainer
            disabled={!onClick}
            onClick={() => {
              onClick && onClick();
              toggle && toggle(true);
            }}>
            <Title Icon={Icon} isAuthor={isAuthor} updateTo={updateTo} authors={authors} title={title} />
          </TitleContainer>

          <HorizontalLine $visibility={visible}>
            <ResultInfoContainer>
              <DefaultTooltip isClick minWidth={helpMinWidth} link={helpLink} text={helpText || 'Ajuda'}>
                <IoMdHelp />
              </DefaultTooltip>
            </ResultInfoContainer>

            {typeof result == 'string' && (
              <>
                {result.split(',').map((info, key) => (
                  <ResultInfoContainer $width={100 / result.split(',').length} key={key}>
                    {info}
                  </ResultInfoContainer>
                ))}
              </>
            )}

            {typeof result == 'number' && (
              <ResultContainer>
                <ResultTitleContainer onClick={() => toggle && toggle()}>
                  {ResultIcon ? <ResultIcon className="result-icon" /> : <></>}
                  {resultTitle}
                </ResultTitleContainer>
                <NumberContainer>
                  <NumberCounter currency={currency} payload={result} />
                </NumberContainer>
              </ResultContainer>
            )}
          </HorizontalLine>
        </Header>

        <ChildrenContainer $visibility={visible}>{children}</ChildrenContainer>
      </HeaderContainer>
    </Container>
  );
};

export default Tab;
