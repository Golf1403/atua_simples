import React, { useEffect, useState } from 'react';

import Title from '@components/Title';
import {
  ChildrenContainer,
  Container,
  DropdownContainer,
  DropdownContent,
  DropdownItem,
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
import { labelsEnum } from '@/enums/labelsEnum';
import NumberCounter from '@/components/NumberCounter';

type DropdownActionImp = { title: string; type: string; onClick: Function };

export interface TabImp {
  title?: string;
  Icon?: IconType;
  ResultIcon?: IconType;
  children: React.ReactChild;
  visible: boolean;
  dropDownActions?: DropdownActionImp[];
  onClick?: Function;
  result: number;
  resultTitle: string;
  currency: string;
  toggle: Function;
  helpText?: string;
  helpLink?: string;
  helpMinWidth?: string;
}
const ArtApplication = ({
  onClick,
  dropDownActions,
  children,
  resultTitle = 'Total do Artigo',
  title = 'Resultado',
  visible,
  result,
  toggle,
  currency,
  Icon,
  ResultIcon,
  helpText,
  helpLink,
  helpMinWidth,
}: TabImp): JSX.Element => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const event = () => {
      setDropdownVisible(!dropdownVisible);
    };
    if (dropdownVisible) document.addEventListener('click', event);

    return () => {
      document.removeEventListener('click', event);
    };
  }, [dropdownVisible]);

  return (
    <Container $visibility={visible}>
      <HeaderContainer>
        <Header>
          <DropdownContainer>
            <TitleContainer
              onClick={() => {
                dropDownActions ? setDropdownVisible(state => !state) : onClick && onClick();
              }}>
              <Title Icon={Icon} title={title} />
            </TitleContainer>

            {dropDownActions && (
              <DropdownContent $isOpen={dropdownVisible}>
                {dropDownActions.map((action, key) => (
                  <DropdownItem $colorType={action.type} key={key} onClick={() => action.onClick()}>
                    {action.title}
                  </DropdownItem>
                ))}
              </DropdownContent>
            )}
          </DropdownContainer>

          <HorizontalLine $visibility={visible}>
            <ResultInfoContainer>
              <DefaultTooltip isClick minWidth={helpMinWidth} link={helpLink} text={helpText || 'Ajuda'}>
                <IoMdHelp />
              </DefaultTooltip>
            </ResultInfoContainer>

            <ResultContainer>
              <ResultTitleContainer onClick={() => toggle && toggle()}>
                {ResultIcon ? <ResultIcon className="result-icon" /> : <></>}
                {resultTitle}
              </ResultTitleContainer>
              <NumberContainer>
                <NumberCounter currency={currency} payload={result} />
              </NumberContainer>
            </ResultContainer>
          </HorizontalLine>
        </Header>

        <ChildrenContainer $visibility={visible}>{children}</ChildrenContainer>
      </HeaderContainer>
    </Container>
  );
};

export default ArtApplication;
