import React, { useEffect, useRef, useState } from 'react';

import Title from '@components/Title';
import {
  CheckboxContainer,
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
import NumberCounter from '@/components/NumberCounter';
import CustomCheckbox from '@/components/CustomCheckbox';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';

type DropdownActionImp = { title: string; type: string; onClick: Function };

export interface TabImp {
  currency?: string;
  result?: number | string;
  title?: string;
  resultTitle?: string;
  Icon?: IconType;
  children: React.ReactChild;
  ResultIcon?: IconType;
  toggle?: (payload?: boolean) => void;
  onClick?: Function;
  visible: boolean;
  isAuthor?: boolean;
  helpText?: string;
  helpLink?: string;
  authors?: CurrentAuthorImp[];
  totalsTooltip?: { title: string; total?: string }[];
  helpMinWidth?: string;
  updateTo?: string;
  dropDownActions?: DropdownActionImp[];
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
  onClick,
  isAuthor,
  helpText,
  helpLink,
  helpMinWidth,
  updateTo,
  dropDownActions,
  checkbox,
  checked,
  onCheckboxChange,
  uppercase = true,
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

  const isDropdown = dropDownActions && dropDownActions.length > 0;

  return (
    <Container $visibility={visible}>
      <HeaderContainer>
        <Header>
          {checkbox ? (
            <CheckboxContainer>
              <CustomCheckbox name="art523" checked={checked || false} onChange={onCheckboxChange} label={title} />
            </CheckboxContainer>
          ) : (
            <DropdownContainer>
              <TitleContainer
                type="button"
                onClick={() => {
                  if (isDropdown) {
                    setDropdownVisible(state => !state);
                  } else if (onClick) {
                    onClick();
                    toggle && toggle(true);
                  }
                }}>
                <Title
                  Icon={Icon}
                  isAuthor={isAuthor}
                  updateTo={updateTo}
                  authors={authors}
                  totalsTooltip={totalsTooltip}
                  title={title || ''}
                  uppercase={uppercase}
                />
              </TitleContainer>

              {isDropdown && (
                <DropdownContent $isOpen={dropdownVisible}>
                  {dropDownActions!.map((action, key) => (
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
          )}

          <HorizontalLine $visibility={visible}>
            <ResultInfoContainer>
              <DefaultTooltip isClick link={helpLink} minWidth={helpMinWidth} text={helpText || 'Ajuda'}>
                <IoMdHelp />
              </DefaultTooltip>
            </ResultInfoContainer>

            {typeof result === 'string' && (
              <>
                {result.split(',').map((info, key) => (
                  <ResultInfoContainer $width={100 / result.split(',').length} key={key}>
                    {info}
                  </ResultInfoContainer>
                ))}
              </>
            )}

            {typeof result === 'number' && (
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
          </HorizontalLine>
        </Header>

        <ChildrenContainer $visibility={visible}>{children}</ChildrenContainer>
      </HeaderContainer>
    </Container>
  );
};

export default Tab;
