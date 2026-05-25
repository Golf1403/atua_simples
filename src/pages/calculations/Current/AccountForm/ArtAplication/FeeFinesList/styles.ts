import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultInput from '@/components/DefaultInput';
import DefaultTooltip from '@/components/DefaultTooltip';
import { FeeFineTypes, typeFeeArt, typeFineArt } from '@/hooks/interfaces/CurrentAccountHookImp';
import {
  ButtonActionDefault,
  coloraero,
  colorbabyponder,
  colorblueE8,
  colorfees,
  colorfine,
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

  label:last-child {
    width: ${rem(70)};
  }

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
`;

export const BorderContainer = styled.div`
  border: 2px solid transparent;

  &:hover {
    border: 2px solid ${coloraero};
  }
`;

export const VerticalLine = styled.div<{ $colorType?: FeeFineTypes }>`
  margin-right: ${rem(16)};
  height: ${rem(40)};

  border-left: 6px solid
    ${props => {
      switch (props.$colorType) {
        case typeFineArt.id:
          return colorfine;
        case typeFeeArt.id:
          return colorfees;
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
  min-width: ${rem(200)};
  width: 100%;
  max-width: ${rem(300)};
  margin-right: ${rem(8)};
  .date-start {
    margin-right: ${rem(4)};
  }
  .date-end {
    margin-left: ${rem(4)};
  }
`;
export const InputDate = styled(DefaultDateInput)``;
export const PeriodicityTaxContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  margin-right: ${rem(8)};
  .select-type {
    margin-right: ${rem(4)};
  }
  .periodicity {
    margin-left: ${rem(4)};
  }
`;
export const ValuePercentContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
`;
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
    text-align: start;
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

export const FeeFineOptions = styled.div`
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
  min-width: ${rem(150)};

  svg {
    font-size: ${rem(15)};
    padding-right: ${rem(4)};

    @media (max-width: ${desktopxxl}) {
      font-size: ${rem(16)};
      padding-right: 1px;
    }
  }
`;

export const FeeFineAction = styled.div`
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
