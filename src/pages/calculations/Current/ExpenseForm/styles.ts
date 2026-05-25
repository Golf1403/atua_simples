import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultInput from '@/components/DefaultInput';
import DefaultTooltip from '@/components/DefaultTooltip';
import { OccurrenceTypes, typeExpense } from '@/hooks/interfaces/CurrentAccountHookImp';
import {
  ButtonActionDefault,
  coloraero,
  colorbabyponder,
  colorblueE8,
  colorexpenses,
  colorgray80,
  desktopxxl,
  fontsm,
  rem,
} from '@/styles/global';
import { Form as CustomForm } from 'formik';
import { styled } from 'styled-components';

export const Form = styled(CustomForm)`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  margin: 2px;

  &:hover {
    margin: 2px;
    background-color: ${colorgray80};
  }
`;

export const BorderContainer = styled.div<{ $isActive?: boolean }>`
  border: 2px solid ${props => (props.$isActive ? colorexpenses : 'transparent')};

  &:hover {
    border: 2px solid ${coloraero};
  }
`;

export const HeaderContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  text-transform: uppercase;
  font-size: ${fontsm};
  padding-bottom: ${rem(2)};

  div {
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
  }
`;
export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  padding: ${rem(16)} 0 ${rem(16)} 0;
  input:focus,
  select:focus {
    background-color: ${colorblueE8};
  }

  div[data-rbd-droppable-id='droppable-current-occurrence'] form:focus {
    &:focus {
      background-color: ${colorgray80};
    }
  }
`;
export const VerticalLine = styled.div`
  margin-right: ${rem(16)};
  height: ${rem(40)};

  border-left: 6px solid ${colorexpenses};
`;

export const Name = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  min-width: ${rem(120)};
`;
export const Input = styled(DefaultInput)``;
export const DescriptionContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  min-width: ${rem(250)};
  -webkit-box-flex: 1;
  -moz-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  margin-right: ${rem(8)};
`;
export const InputDateContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: ${rem(300)};
  min-width: ${rem(200)};
  width: 100%;
  max-width: ${rem(300)};
  margin-right: ${rem(8)};
  .update-since {
    margin-right: ${rem(4)};
  }
  .date {
    margin-left: ${rem(4)};
  }
`;
export const InputDate = styled(DefaultDateInput)``;

export const InputContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  min-width: ${rem(200)};
  width: 100%;
  max-width: ${rem(400)};
  label {
    width: 50%;
    text-align: center;
  }
  .tax {
    margin-right: ${rem(4)};
  }
  .value {
    margin-left: ${rem(4)};
  }
`;

export const BackgroudContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: flex-end;
  -moz-justify-content: flex-end;
  -ms-justify-content: flex-end;
  justify-content: flex-end;
  font-size: ${rem(12)};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.1875rem;
  background-color: ${colorbabyponder};
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  min-width: ${rem(64)};
  align-items: center;
  height: ${rem(35)};
`;

export const ExpenseAction = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: flex-end;
  -moz-justify-content: flex-end;
  -ms-justify-content: flex-end;
  justify-content: flex-end;
  margin-left: ${rem(8)};
  width: ${rem(70)};

  svg {
    font-size: ${rem(24)};
    padding-right: ${rem(4)};
    @media (max-width: ${desktopxxl}) {
      font-size: ${rem(16)};
      padding-right: 1px;
    }
  }
`;

export const Tooltip = styled(DefaultTooltip)``;

export const ButtonAction = styled(ButtonActionDefault)`
  &:focus {
    background: ${coloraero};
  }
`;
