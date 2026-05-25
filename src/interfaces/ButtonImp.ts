import { IconType } from 'react-icons/lib';

export default interface ButtonImp {
  className?: string;
  handleOnClick?: Function;
  disabled?: boolean;
  icon?: IconType;
  id?: string;
  label: string | JSX.Element;
  type: 'button' | 'submit' | 'reset' | undefined;
}
