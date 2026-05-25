import React from 'react';

import Title from '@components/Title';
import NumberCounter from '../../../../../components/NumberCounter';
import {
  CheckboxContainer,
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
  totalsTooltip?: { title: string; total?: string }[];
  resultTooltip?: { title: string; total?: string }[];
  helpMinWidth?: string;
  updateTo?: string;
  checkbox?: boolean;
  checked?: boolean;
  onCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uppercase?: boolean;
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
  totalsTooltip,
  resultTooltip,
  onClick,
  isAuthor,
  helpText,
  helpLink,
  helpMinWidth,
  updateTo,
  checkbox,
  checked,
  onCheckboxChange,
  uppercase = true,
}: TabImp): JSX.Element => {
  return (
    <Container $visibility={visible}>
      <HeaderContainer>
        <Header>
          <TitleContainer
            type="button"
            $checkbox={checkbox}
            disabled={!onClick && !checkbox}
            onClick={event => {
              if (checkbox) {
                const target = event.target as HTMLElement;
                if (target.tagName.toLocaleLowerCase() !== 'input') onClick && onClick();
                return;
              }

              onClick && onClick();
              toggle && toggle(true);
            }}>
            {checkbox ? (
              <CheckboxContainer>
                <input
                  type="checkbox"
                  name="art523"
                  checked={checked || false}
                  onChange={onCheckboxChange}
                  onClick={event => event.stopPropagation()}
                  style={{ width: '15px', height: '15px' }}
                />
                <span style={{ color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', paddingLeft: '8px' }}>
                  {uppercase ? title?.toLocaleUpperCase() : title}
                </span>
              </CheckboxContainer>
            ) : (
              <Title
                Icon={Icon}
                isAuthor={isAuthor}
                updateTo={updateTo}
                authors={authors}
                totalsTooltip={totalsTooltip}
                title={title || ''}
                uppercase={uppercase}
              />
            )}
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
              <>
                {resultTooltip?.length ? (
                  <DefaultTooltip totalsTooltip={resultTooltip}>
                    <ResultContainer>
                      <ResultTitleContainer type="button" onClick={() => toggle && toggle()}>
                        {ResultIcon ? <ResultIcon className="result-icon" /> : <></>}
                        {resultTitle}
                      </ResultTitleContainer>
                      <NumberContainer>
                        <NumberCounter currency={currency} payload={result} />
                      </NumberContainer>
                    </ResultContainer>
                  </DefaultTooltip>
                ) : (
                  <ResultContainer>
                    <ResultTitleContainer type="button" onClick={() => toggle && toggle()}>
                      {ResultIcon ? <ResultIcon className="result-icon" /> : <></>}
                      {resultTitle}
                    </ResultTitleContainer>
                    <NumberContainer>
                      <NumberCounter currency={currency} payload={result} />
                    </NumberContainer>
                  </ResultContainer>
                )}
              </>
            )}
          </HorizontalLine>
        </Header>

        <ChildrenContainer $visibility={visible}>{children}</ChildrenContainer>
      </HeaderContainer>
    </Container>
  );
};

export default Tab;
