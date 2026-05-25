import ButtonDefault from '@/components/ButtonDefault';
import { fontmd, rem } from '@/styles/global';
import DefaultDataTable from '@components/DataTable';
import { styled } from 'styled-components';

export const DataTable = styled(DefaultDataTable)``;
export const Button = styled(ButtonDefault)``;
export const TextContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  height: ${rem(60)};
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
`;
export const Text = styled.p`
  font-size: ${fontmd};
`;

export const ButtonContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  button {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
    align-items: center;
    width: ${rem(32)};
    height: ${rem(32)};
  }

  button + button {
    margin-left: ${rem(8)};
  }
`;
