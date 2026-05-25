import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultInput from '@/components/DefaultInput';
import DefaultTooltip from '@/components/DefaultTooltip';
import {
  OccurrenceTypes,
  typeExpense,
  typeFee,
  typePayment,
  typeinstallment,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import {
  ButtonActionDefault,
  coloraero,
  colorbabyponder,
  colorblueE8,
  colorexpenses,
  colorfees,
  colorgray80,
  colorinstallments,
  colorpayments,
  colorstategray,
  colorwhite,
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
  margin: 2px;

  &:hover {
    margin: 2px;
    background-color: ${colorgray80};
  }
`;

const getOccurrenceColor = (type?: OccurrenceTypes) => {
  switch (type) {
    case typeinstallment.id:
      return colorinstallments;
    case typePayment.id:
      return colorpayments;
    case typeFee.id:
      return colorfees;
    case typeExpense.id:
      return colorexpenses;
    default:
      return 'transparent';
  }
};

export const OccurrenceCard = styled.div<{ $colorType?: OccurrenceTypes; $isActive?: boolean }>`
  border: 2px solid ${props => (props.$isActive ? getOccurrenceColor(props.$colorType) : colorgray80)};
  border-left: ${rem(6)} solid ${props => getOccurrenceColor(props.$colorType)};
  margin-bottom: ${rem(8)};
  background-color: ${colorbabyponder};
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: ${coloraero};
  }
`;

export const MainRow = styled(Form)`
  min-height: ${rem(36)};
  margin: 0;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    margin: 0;
  }
`;

export const SubRow = styled.div`
  display: flex;
  align-items: center;
  min-height: ${rem(26)};
  color: ${colorstategray};
  font-size: ${fontsm};
`;

export const SubDescription = styled.div`
  display: flex;
  min-width: ${rem(160)};
  flex: 1 1 ${rem(220)};
  margin-right: ${rem(8)};
  padding-left: ${rem(8)};
  gap: ${rem(24)};
`;

export const SubDateContainer = styled.div`
  display: flex;
  flex: 0 1 ${rem(190)};
  min-width: ${rem(140)};
  max-width: ${rem(220)};
  margin-right: ${rem(8)};
  justify-content: center;
  gap: ${rem(18)};
`;

export const SubValueContainer = styled.div`
  display: flex;
  flex: 0 1 ${rem(190)};
  min-width: ${rem(130)};
  max-width: ${rem(220)};
  justify-content: center;
  font-size: ${fontsm};
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

export const TypeBadge = styled.button`
  color: ${colorwhite};
  background-color: ${coloraero};
  border-radius: ${rem(4)};
  font-size: ${fontsm};
  font-weight: bold;
  padding: ${rem(3)} ${rem(6)};
  margin-left: ${rem(4)};
  cursor: pointer;
`;

export const DetailFlag = styled.span`
  color: ${coloraero};
  font-size: ${fontsm};
  font-weight: bold;
  margin-left: ${rem(4)};
`;

export const IndexText = styled.span`
  color: ${colorstategray};
  font-size: ${fontmd};
  padding-left: ${rem(8)};
`;

export const BorderContainer = styled.div<{ $colorType?: OccurrenceTypes }>`
  border: 2px solid ${props => getOccurrenceColor(props.$colorType)};

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
export const VerticalLine = styled.div<{ $colorType?: OccurrenceTypes }>`
  margin-right: ${rem(16)};
  height: ${rem(40)};

  border-left: 6px solid
    ${props => {
      switch (props.$colorType) {
        case typeinstallment.id:
          return colorinstallments;
        case typePayment.id:
          return colorpayments;
        case typeFee.id:
          return colorfees;
        case typeExpense.id:
          return colorexpenses;
      }
    }};
`;

export const Name = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  min-width: ${rem(130)};
  max-width: ${rem(130)};
  word-break: break-all;
  max-height: calc(1.5em * 3);
  overflow: hidden;
  line-height: 1.5;
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
  gap: ${rem(2)};
  align-items: center;
  height: ${rem(35)};
`;

export const OccurrenceAction = styled.div`
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
  min-width: ${rem(170)};
  width: ${rem(170)};
  flex-shrink: 0;
  gap: ${rem(3)};
  align-items: center;

  svg {
    font-size: ${rem(24)};
    padding-right: ${rem(4)};
    @media (max-width: ${desktopxxl}) {
      font-size: ${rem(16)};
      padding-right: 1px;
    }
  }
`;

export const Tooltip = styled(DefaultTooltip)`
  font-size: ${rem(24)};
`;

export const ButtonAction = styled(ButtonActionDefault)`
  color: ${colorstategray};

  &:focus {
    background: ${coloraero};
  }
`;
