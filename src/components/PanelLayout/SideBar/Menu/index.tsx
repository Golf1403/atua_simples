import React from 'react';
import AsideMenuLinkImp, { AsideMenuSectionImp } from '@/interfaces/AsideMenuLinkImp';
import { ApplicationState } from '@/store';
import { FaCogs, FaQuestion, FaSignOutAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Content, Link, LinkContainer, Text, Title } from './styles';
import DefaultModal from '@/components/DefaultModal';
import { useUser } from '@/hooks/user';
import { LinksEnum } from '@/enums/LinkEnums';
import logout from '@/services/http/logout';

const Menu = ({ data }: { data: AsideMenuSectionImp[] }) => {
  const history = useHistory();
  const { ability } = useSelector((state: ApplicationState) => state.auth);
  const {
    user: { group },
  } = useUser();
  const [logoutIsOpen, setLogoutIsOpen] = React.useState<boolean>(false);

  const isCurrentPage = (pageUrl: string): boolean => {
    return location.pathname.indexOf(pageUrl) !== -1;
  };

  const handleClick = (url: string) => history.push(url, { reset: true });

  const openLogoutModal = (): void => {
    setLogoutIsOpen(true);
  };

  const closeLogoutModal = (): void => {
    setLogoutIsOpen(false);
  };

  const openSaveLogoutModal = async () => {
    logout();
  };

  const renderHelp = () => {
    const helpAbility = ability.rules.find((rule: any) => rule.subject === 'Help' && rule.action === 'view');
    const helpLink = helpAbility?.conditions?.limitText ? String(helpAbility.conditions.limitText) : LinksEnum.HELP;

    const chatAbility = ability.rules.find((rule: any) => rule.subject === 'Chat' && rule.action === 'view');
    const chatLink = chatAbility?.conditions?.limitText ? String(chatAbility.conditions.limitText) : LinksEnum.CHAT;

    return (
      <Content>
        <Title $cursor={true}>
          <FaQuestion />
          Dúvidas
        </Title>

        <LinkContainer>
          {helpAbility && (
            <Link $active={false} onClick={() => window.open(helpLink, '_blank')}>
              Ajuda
            </Link>
          )}
          {chatAbility && (
            <Link $active={false} onClick={() => window.open(chatLink, '_blank')}>
              Chat
            </Link>
          )}
        </LinkContainer>
      </Content>
    );
  };

  return (
    <Container>
      {data.map((section, index) => {
        const { icon: Icon, pages } = section;

        return (
          <Content key={index}>
            {section.groups.includes(group || 'guest') && (
              <Title>
                {Icon ? <Icon /> : <FaCogs />}
                {section.title}
              </Title>
            )}
            <LinkContainer>
              {pages.map((page: AsideMenuLinkImp, key) => {
                if (ability.can(page.action, page.subject) && page.groups.includes(group || 'guest')) {
                  return (
                    <Link $active={isCurrentPage(page.pageUrl)} onClick={() => handleClick(page.pageUrl)} key={key}>
                      {page.pageName}
                    </Link>
                  );
                }
                return;
              })}
            </LinkContainer>
          </Content>
        );
      })}

      {renderHelp()}

      <Title $cursor={true} onClick={() => openLogoutModal()}>
        <FaSignOutAlt />
        Sair do sistema
      </Title>

      <DefaultModal
        title="Confirmar"
        type="button"
        isOpen={logoutIsOpen}
        onCancel={closeLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={openSaveLogoutModal}>
        <Text>Deseja sair do sistema?</Text>
      </DefaultModal>
    </Container>
  );
};

export default Menu;
