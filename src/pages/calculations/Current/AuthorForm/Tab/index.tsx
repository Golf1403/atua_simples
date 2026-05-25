import React, { useEffect, useRef, useState } from 'react';

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
  ResultInfoContainer,
  TitleContainer,
} from './styles';
import { IconType } from 'react-icons';
import { IoMdHelp } from 'react-icons/io';
import DefaultTooltip from '@/components/DefaultTooltip';

type DropdownActionImp = { title: string; type: string; onClick: Function };

export interface TabImp {
  title?: string;
  Icon?: IconType;
  children: React.ReactChild;
  visible: boolean;
  dropDownActions?: DropdownActionImp[];
  onClick?: Function;
  helpText?: string;
  helpLink?: string;
  helpMinWidth?: string;
}

const Tab = ({
  title = 'Resultado',
  onClick,
  dropDownActions,
  children,
  visible,
  Icon,
  helpLink,
  helpMinWidth,
  helpText,
}: TabImp): JSX.Element => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const onClose = () => {
      setDropdownVisible(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && dropDownActions && dropDownActions.length > 0) {
        e.preventDefault();
        const dropdownItemsLength = dropdownItemsRef.current.length - 1;

        setIndex(_index => {
          const currentIndex = _index + 1 > dropdownItemsLength ? 0 : _index + 1;
          if (dropdownItemsRef.current[currentIndex]) (dropdownItemsRef.current[currentIndex] as any).focus();
          return currentIndex;
        });
      }

      if (e.key === 'ArrowUp' && dropDownActions && dropDownActions.length > 0) {
        e.preventDefault();
        setIndex(_index => {
          const currentIndex = _index - 1 < 0 ? 0 : _index - 1;
          if (dropdownItemsRef.current[currentIndex]) (dropdownItemsRef.current[currentIndex] as any).focus();
          return currentIndex;
        });
      }

      if (e.key === 'Escape' && dropDownActions && dropDownActions.length > 0) {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'Enter') {
        const focusedElement = document.activeElement as HTMLDivElement;
        const index = dropdownItemsRef.current.indexOf(focusedElement);

        if (index > -1) {
          e.preventDefault();
          dropdownItemsRef.current[index]?.click();
          onClose();
        }
      }
    };

    if (dropdownVisible) {
      document.addEventListener('click', onClose);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      setIndex(-1);
      document.removeEventListener('click', onClose);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownVisible, dropDownActions, setIndex]);

  const handleDropdownItemRef = (index: number) => (element: HTMLDivElement) => {
    dropdownItemsRef.current[index] = element;
  };

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
                  <DropdownItem
                    ref={handleDropdownItemRef(key)}
                    tabIndex={0}
                    $colorType={action.type}
                    $index={index}
                    id={action.type}
                    key={key}
                    $key={key}
                    onClick={() => action.onClick()}>
                    {action.title}
                  </DropdownItem>
                ))}
              </DropdownContent>
            )}
          </DropdownContainer>

          <HorizontalLine $visibility={visible}>
            <ResultInfoContainer>
              <DefaultTooltip isClick link={helpLink} minWidth={helpMinWidth} text={helpText || 'Ajuda'}>
                <IoMdHelp />
              </DefaultTooltip>
            </ResultInfoContainer>
          </HorizontalLine>
        </Header>

        <ChildrenContainer $visibility={visible}>{children}</ChildrenContainer>
      </HeaderContainer>
    </Container>
  );
};

export default Tab;
