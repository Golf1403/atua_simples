import React from 'react';
import AsideMenuLinkImp, { AsideMenuSectionImp } from '@/interfaces/AsideMenuLinkImp';
import { ApplicationState } from '@/store';
import { FaCogs } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Content, Link, LinkContainer, Title } from './styles';
import { useUser } from '@/hooks/user';

const Menu = ({ data }: { data: AsideMenuSectionImp[] }) => {
  const history = useHistory();
  const { ability } = useSelector((state: ApplicationState) => state.auth);
  const {
    user: { group },
  } = useUser();

  const isCurrentPage = (pageUrl: string): boolean => {
    return location.pathname.indexOf(pageUrl) !== -1;
  };

  const handleClick = (url: string) => history.push(url, { reset: true });

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
    </Container>
  );
};

export default Menu;
