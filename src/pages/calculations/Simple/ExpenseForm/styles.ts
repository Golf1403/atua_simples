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
  colorstategray,
  desktopxxl,
  fontmd,
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
  min-height: ${rem(42)};
  margin: 2px;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    margin: 2px;
    background-color: ${colorgray80};
  }
`;

export const BorderContainer = styled.div<{ $isActive?: boolean }>`
  border: 2px solid ${props => (props.$isActive ? colorexpenses : 'transparent')};
  width: 100%;
  box-sizing: border-box;

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
  width: 100%;
  box-sizing: border-box;
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
  padding: ${rem(16)} ${rem(8)} ${rem(16)} 0;
  box-sizing: border-box;
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
  margin-right: ${rem(10)};
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
  align-self: stretch;
  min-width: ${rem(130)};
  max-width: ${rem(130)};
`;

export const IndexText = styled.span`
  color: ${colorstategray};
  font-size: ${fontmd};
`;

export const Input = styled(DefaultInput)``;
export const DescriptionContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  min-width: ${rem(160)};
  -webkit-box-flex: 1;
  -moz-flex: 1;
  -webkit-flex: 1 1 ${rem(220)};
  flex: 1 1 ${rem(220)};
  margin-right: ${rem(8)};
`;
export const InputDateContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-flex: 0 1 ${rem(190)};
  flex: 0 1 ${rem(190)};
  min-width: ${rem(140)};
  max-width: ${rem(220)};
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
  -webkit-flex: 0 1 ${rem(190)};
  flex: 0 1 ${rem(190)};
  min-width: ${rem(130)};
  max-width: ${rem(220)};
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

export const CorrectedContainer = styled.div`
  display: flex;
  flex: 0 1 ${rem(150)};
  min-width: ${rem(118)};
  max-width: ${rem(170)};
  justify-content: center;
  align-items: center;
  color: ${colorstategray};
  font-size: ${fontmd};
`;

export const BackgroudContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  font-size: ${rem(12)};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.1875rem;
  background-color: ${colorbabyponder};
  width: auto;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  min-width: ${rem(64)};
  padding: 0 ${rem(4)};
  gap: ${rem(4)};
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
  margin-left: ${rem(6)};
  margin-right: ${rem(4)};
  min-width: ${rem(132)};
  width: ${rem(132)};
  flex-shrink: 0;

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
  color: ${colorstategray};

  &:focus {
    background: ${coloraero};
  }
`;
