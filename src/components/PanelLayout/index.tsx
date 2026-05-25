import React, { Fragment, useEffect, useState } from 'react';
import SideBar from './SideBar';
import {
  Container,
  Section,
  Header,
  Content,
  LogoImage,
  Button,
  ToolbarContainer,
  ChildrenContainer,
  DropdownContainer,
  DropdownItem,
  DropdownContent,
  LogoContainer,
  UserContainer,
  UserLogoContainer,
  UserContentContainer,
  VersionDateContainer,
} from './styles';
import { useCore } from '@/hooks/core';
import Logo from '@/images/SEI-logo.png';
import Title from '../Title';
import Tooltip from '../DefaultTooltip';
import { MdMenu } from 'react-icons/md';
import { TitleContainer } from '@/styles/global';
import DefaultResult from '../DefaultResult';
import ToolBar from '../ToolBar';
import { useToolbar } from '@/hooks/toolbar';
import getUserGroup from '@/utils/getUserGroup';
import { useUser } from '@/hooks/user';

import UserDefaultImage from 'images/user-default-image.png';
import { useHistory } from 'react-router-dom';

interface IProps {
  children: JSX.Element;
}

type DropdownActionImp = { title: string; onClick: Function };

const PanelLayout = (props: IProps): JSX.Element => {
  const { children } = props;
  const toolbar = useToolbar();
  const { results, sidebar, setSidebar } = useCore();
  const {
    user: { group, lastName, firstName },
  } = useUser();
  const history = useHistory();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropDownActions, setDropDownActions] = useState<DropdownActionImp[]>([]);

  useEffect(() => {
    const _dropDownActions: DropdownActionImp[] = [];
    group?.includes('owner') &&
      _dropDownActions.push({
        onClick: () => {
          history.push('/user/licenses');
        },
        title: `Licenças`,
      });
    setDropDownActions(_dropDownActions);
  }, []);

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
    <Container>
      <Header>
        <Button onClick={() => setSidebar(sidebar => ({ ...sidebar, visible: !sidebar.visible }))}>
          <Tooltip text="Menu (CTRL+B)">
            <MdMenu />
          </Tooltip>
        </Button>
        <LogoContainer>
          <LogoImage
            onClick={() => {
              setDropdownVisible(state => !state);
            }}
            loading="eager"
            src={Logo}
            alt="SEI Cálculos"
          />

          <DropdownContainer>
            {dropDownActions && (
              <DropdownContent $isOpen={dropdownVisible}>
                <UserContainer>
                  <UserLogoContainer>
                    <img width="100%" height="100%" src={UserDefaultImage} alt="" />
                  </UserLogoContainer>
                  <UserContentContainer>
                    <span>
                      {firstName} {lastName}
                    </span>
                    <p>{getUserGroup(group)}</p>
                  </UserContentContainer>
                </UserContainer>
                <DropdownItem onClick={() => history.go(0)}>
                  <a href="/">Página inicial</a>
                </DropdownItem>
                {dropDownActions.map((action, key) => (
                  <DropdownItem key={key} onClick={() => action.onClick()}>
                    <a>{action.title}</a>
                  </DropdownItem>
                ))}

                <VersionDateContainer>
                  Data da versão: {process.env.REACT_APP_DATE_VERSION || 'v1'}
                </VersionDateContainer>
              </DropdownContent>
            )}
          </DropdownContainer>
        </LogoContainer>

        <TitleContainer>{sidebar.title && <Title title={sidebar.title} />}</TitleContainer>

        <ToolbarContainer>
          <ToolBar />
        </ToolbarContainer>
      </Header>

      <Content>
        <SideBar />
        <Section open={sidebar.visible}>
          <ChildrenContainer $type={toolbar.type}>{children}</ChildrenContainer>
          {results.map(({ title, currency, result, suffix, onClick }, index) => (
            <DefaultResult
              key={index}
              title={title}
              suffix={suffix}
              onClick={onClick}
              currency={currency}
              result={result}
            />
          ))}
        </Section>
      </Content>
    </Container>
  );
};

export default PanelLayout;
