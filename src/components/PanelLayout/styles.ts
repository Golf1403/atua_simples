import { pathEnum } from '@/enums/pathEnum';
import { colorbabyponder, coloraero, colorwhite, rem, colorgray80, colorbabyblue } from '@/styles/global';
import { css, styled } from 'styled-components';

export const heightHeader = rem(64);
export const borderBottomHeader = rem(2);

export const marginTop = heightHeader;

export const paddingChildren = rem(16);
export const paddingSection = rem(24);

export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  justify-content: space-between;
  background-color: ${colorbabyponder};
  min-height: ${rem(200)};
  height: 100%;
  width: 100%;
`;

export const Content = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  margin-top: ${marginTop};
  height: 100%;
  width: 100%;
`;

export const Section = styled.section<{ open: boolean }>`
  padding: ${paddingSection};
  width: 100%;
  height: 100%;
  position: relative;
`;

export const ChildrenContainer = styled.div<{ $type?: pathEnum }>`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: ${rem(200)};
  height: 100%;
  ${props =>
    props.$type != pathEnum.CURRENT_ACCOUNT &&
    css`
      border: 1px solid ${colorgray80};
      box-shadow: 0 0 ${rem(8)} rgba(0, 0, 0, 0.2);
      background-color: ${colorwhite};
    `}

  padding: ${paddingChildren};
`;

export const Header = styled.header`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 2;
  background-color: ${colorwhite};
  width: 100%;
  height: ${heightHeader};
  border-bottom: ${rem(2)} solid ${coloraero};
  box-shadow: 0 0 ${rem(8)} rgba(0, 0, 0, 0.2);
`;

export const ToolbarContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  position: absolute;
  right: 0;
`;

export const Button = styled.button`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  background: transparent;
  align-items: center;
  width: ${rem(64)};
  svg {
    color: ${coloraero};
    width: ${rem(64)};
    font-size: ${rem(30)};
  }
`;

export const LogoImage = styled.img`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  height: 100%;
  background-color: ${colorwhite};
  max-height: calc(${heightHeader} - ${rem(8)});
  margin-left: ${rem(12)};
`;

export const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props: { $isOpen: boolean }) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: ${rem(250)};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

export const DropdownItem = styled.div`
  padding: 12px ${rem(15)};
  display: block;
  text-decoration: none;
  color: black;

  &:hover {
    background-color: ${colorbabyblue};
  }
`;
export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${rem(72)};
`;

export const UserLogoContainer = styled.div`
  height: ${rem(56)};
  width: ${rem(56)};
`;
export const UserContentContainer = styled.div`
  padding-left: ${rem(16)};
`;
export const VersionDateContainer = styled.p`
  padding: 12px ${rem(15)};
`;
