import { fontlg, rem } from '@/styles/global';
import { Form as FormikForm } from 'formik';
import styled from 'styled-components';

export const Form = styled(FormikForm)`
  width: ${rem(800)};
  height: ${rem(500)};
  padding: ${rem(16)};
  overflow: hidden;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
`;

export const ContainerButton = styled.div`
  padding: ${rem(8)} 0;
`;

export const Image = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  img {
    background-size: cover;
    width: 80%;
    height: 75%;
  }
  flex: 1;
`;
export const Input = styled.input`
  display: none;
`;
export const Header = styled.div`
  width: ${rem(400)};
  height: ${rem(350)};
`;
export const Config = styled.div``;
export const SelectContainer = styled.div`
  display: flex;
  justify-content: space-around;
  select {
    width: 90%;
  }
`;
export const CheckboxContainer = styled.div`
  padding: ${rem(20)} ${rem(20)};
  display: flex;
  justify-content: space-around;
`;
export const ImageConfig = styled.div`
  display: flex;
  width: ${rem(300)};
  justify-content: space-around;
  button {
    height: ${rem(30)};
    background: transparent;
  }
`;
export const DividerButton = styled.div`
  display: flex;
`;
export const DividerCheckbox = styled.div`
  padding-top: ${rem(4)};
  display: flex;
  justify-content: space-around;
`;
export const RemoveImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rem(400)};
  height: ${rem(100)};
  p {
    font-size: ${fontlg};
  }
`;

export const ToolsContainerModal = styled.div`
  height: ${rem(108)};
`;
