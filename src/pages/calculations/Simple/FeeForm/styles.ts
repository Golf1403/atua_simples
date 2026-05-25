import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultInput from '@/components/DefaultInput';
import DefaultTooltip from '@/components/DefaultTooltip';
import {
  ButtonActionDefault,
  coloraero,
  colorbabyponder,
  colorblueE8,
  colorfees,
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
  display: flex;
  align-items: center;
  min-height: ${rem(42)};
  margin: 2px;
  width: calc(100% - 4px);
  box-sizing: border-box;

  &:hover {
    margin: 2px;
    background-color: ${colorgray80};
  }
`;

export const BorderContainer = styled.div<{ $isActive?: boolean }>`
  border: 2px solid ${props => (props.$isActive ? colorfees : 'transparent')};
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border: 2px solid ${coloraero};
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  text-transform: uppercase;
  font-size: ${fontsm};
  padding-bottom: ${rem(2)};

  div {
    justify-content: center;
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
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
  align-self: stretch;
  margin-right: ${rem(10)};
  min-height: ${rem(40)};
  border-left: 6px solid ${colorfees};
`;

export const Name = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  min-width: ${rem(130)};
  max-width: ${rem(130)};
`;

export const IndexText = styled.span`
  color: ${colorstategray};
  font-size: ${fontmd};
`;

export const Input = styled(DefaultInput)``;

export const DescriptionContainer = styled.div`
  display: flex;
  min-width: ${rem(150)};
  flex: 1 1 ${rem(180)};
  margin-right: ${rem(8)};
`;

export const PercentageContainer = styled.div`
  display: flex;
  flex: 0 0 ${rem(78)};
  min-width: ${rem(78)};
  max-width: ${rem(78)};
  margin-right: ${rem(8)};

  label {
    width: 100%;
    text-align: center;
  }
`;

export const InputDateContainer = styled.div`
  display: flex;
  flex: 0 0 ${rem(170)};
  min-width: ${rem(170)};
  max-width: ${rem(170)};
  margin-right: ${rem(8)};

  .update-since {
    display: none;
  }

  .date {
    margin-left: 0;
    width: ${rem(150)};

    input {
      min-width: ${rem(150)} !important;
      width: ${rem(150)} !important;
    }
  }
`;

export const InputDate = styled(DefaultDateInput)``;

export const InputContainer = styled.div`
  display: flex;
  flex: 0 0 ${rem(190)};
  min-width: ${rem(190)};
  max-width: ${rem(190)};
  margin-right: ${rem(8)};

  label {
    width: 100%;
    text-align: center;
  }

  .tax {
    display: none;
  }

  .value {
    margin-left: 0;
    min-width: ${rem(170)} !important;
    width: ${rem(170)} !important;
  }
`;

export const CorrectedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 ${rem(120)};
  min-width: ${rem(120)};
  max-width: ${rem(120)};
  margin-right: ${rem(8)};
  color: ${colorstategray};
  font-size: ${fontmd};
  white-space: nowrap;
`;

export const CpcAction = styled.button`
  margin-left: ${rem(4)};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${coloraero};
  font-size: ${fontsm};
  font-weight: 700;
  cursor: pointer;
`;

export const BackgroudContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${rem(4)};
  padding: 0 ${rem(4)};
  font-size: ${rem(12)};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.1875rem;
  background-color: ${colorbabyponder};
  width: auto;
  min-width: ${rem(80)};
  height: ${rem(35)};
  appearance: none;
`;

export const ExpenseAction = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: ${rem(4)};
  margin-right: ${rem(4)};
  width: ${rem(96)};
  min-width: ${rem(96)};
  flex-shrink: 0;
  color: ${colorstategray};

  svg {
    font-size: ${rem(18)};
    color: ${colorstategray};

    @media (max-width: ${desktopxxl}) {
      font-size: ${rem(16)};
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
