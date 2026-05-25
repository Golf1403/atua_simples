import React, { useEffect, useState } from 'react';
import { Button, Container, DropdownContainer, DropdownContent, DropdownItem, NumberInfo, Text, Title } from './styles';
import { IoMdArrowDropdown } from 'react-icons/io';
import DashboardResponseImp from '@/interfaces/serviceResponses/DashboardResponseImp';
import AccountServices from '@/services/AccountServices';
import UserServices from '@/services/UserServices';

const initialDash = {
  accounts: 0,
  user: { users: 0, connecteds: 0 },
  plan: { name: null, days: 0, createdAt: null },
  costCenters: 0,
  visible: false,
};
const DashboardToolbar = (): JSX.Element => {
  const userService = new UserServices();
  const accountService = new AccountServices();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dash, setDash] = useState<DashboardResponseImp>(initialDash);

  useEffect(() => {
    const event = () => {
      setDropdownVisible(!dropdownVisible);
    };
    if (dropdownVisible) document.addEventListener('click', event);

    return () => {
      document.removeEventListener('click', event);
    };
  }, [dropdownVisible]);

  const fetchData = async () => {
    try {
      const dashReceived = await accountService.getDashboard();
      const costCenters = await accountService.listCostCenter();
      const users = await userService.listUsers();

      dash.costCenters = costCenters.length;
      dashReceived.user.users = users.total;

      setDash({ ...dash, ...dashReceived });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setDash(initialDash);
    };
  }, []);

  return (
    <Container>
      <Button onClick={() => setDropdownVisible(isVisible => !isVisible)}>
        <IoMdArrowDropdown />
        <Text>Meu Plano</Text>
      </Button>
      <DropdownContainer>
        <DropdownContent $isOpen={dropdownVisible}>
          <DropdownItem>
            <Title>Cálculos</Title>
            <NumberInfo>{dash.accounts}</NumberInfo>
          </DropdownItem>
          <DropdownItem>
            <Title>Usuários</Title>
            <NumberInfo>{dash.user.users}</NumberInfo>
          </DropdownItem>
          <DropdownItem>
            <Title>Conectados</Title>
            <NumberInfo>{dash.user.connecteds}</NumberInfo>
          </DropdownItem>
          <DropdownItem>
            <Title>Centro de Custo</Title>
            <NumberInfo>{dash.costCenters}</NumberInfo>
          </DropdownItem>
          <DropdownItem>
            <Title>Plano</Title>
            <NumberInfo>{dash.plan.name}</NumberInfo>
          </DropdownItem>
          <DropdownItem isExp>
            <Title>Período</Title>
            <NumberInfo>{dash.plan.days == 30 ? 'Mensal' : 'Anual'}</NumberInfo>
          </DropdownItem>
          <DropdownItem isExp>
            <Title>Expira em</Title>
            <NumberInfo>10 dias</NumberInfo>
          </DropdownItem>
        </DropdownContent>
      </DropdownContainer>
    </Container>
  );
};

export default DashboardToolbar;
