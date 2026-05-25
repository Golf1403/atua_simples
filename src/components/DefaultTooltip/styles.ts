import { coloraero, colorbabyponder, colorblack, colormiddleyellow, fontmd, rem } from '@/styles/global';
import styled, { css } from 'styled-components';

export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
`;

export const TableBodyAuthor = styled.tbody``;

export const TableAuthor = styled.table`
  display: flex;
  flex-direction: column;
  min-width: ${rem(50)};
  min-height: ${rem(100)};
`;

export const RowAuthor = styled.tr`
  display: flex;
  flex-direction: row;
  &:first-child {
    font-weight: bold;
  }
  &:last-child {
    font-weight: bold;
  }
`;

export const ColumnAuthor = styled.td<{ $type?: string }>`
  ${props => {
    switch (props.$type) {
      case 'title':
        return css`
          width: ${rem(250)};
          text-align: start;
        `;
      case 'total':
        return css`
          flex: 1;
          text-align: end;
        `;
      default:
        return;
    }
  }};
  margin: 5px 10px;
`;

export const TooltipBox = styled.div<{ $placement: string; $arrow: boolean; $minWidth?: string }>`
  position: absolute;
  background-color: ${colormiddleyellow};
  border: 1px solid #ccc;
  padding: ${rem(4)};
  box-shadow: 0 2px ${rem(2)} rgba(0, 0, 0, 0.15);
  color: ${colorblack};
  min-width: ${rem(150)};
  width: 100%;
  overflow-wrap: break-word;

  p {
    font-weight: initial;
  }

  z-index: 10;
  ${({ $placement }) => getTooltipPosition($placement)}
  ${({ $arrow }) => $arrow && arrowStyle}
  min-width: ${({ $minWidth }) => $minWidth}
`;

export const Arrow = styled.div<{ $placement: string }>`
  width: 10px;
  height: 10px;
  position: absolute;
  background: inherit;
  transform: rotate(45deg);
  ${({ $placement }) => getArrowPosition($placement)}
`;

export const getTooltipPosition = ($placement: string) => {
  switch ($placement) {
    case 'top':
      return css`
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 8px;
      `;
    case 'bottom':
      return css`
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 8px;
      `;
    case 'left':
      return css`
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 8px;
      `;
    case 'right':
      return css`
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 8px;
      `;
    default:
      return css`
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 8px;
      `;
  }
};

export const getArrowPosition = ($placement: string) => {
  switch ($placement) {
    case 'top':
      return css`
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
      `;
    case 'bottom':
      return css`
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
      `;
    case 'left':
      return css`
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
      `;
    case 'right':
      return css`
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
      `;
    default:
      return css``;
  }
};

export const arrowStyle = css`
  &::before {
    content: '';
    position: absolute;
    background-color: ${colormiddleyellow};
    transform: rotate(45deg);
  }
`;
