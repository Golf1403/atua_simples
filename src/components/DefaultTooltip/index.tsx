import React, { useRef, useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import MemCalcImp from '@interfaces/MemCalcImp';
import { capitalize } from '../../utils/stringHelper';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import CivilCodeInterest from '../../enums/CivilCodeInterest';
import { getCivilCodeType, getMarkedInterest } from '../../utils/interestCivilCodeHelper';
import { PeriodImp } from '@interfaces/calculations/MonetaryFineImp';
import { Arrow, ColumnAuthor, RowAuthor, TableAuthor, TableBodyAuthor, TooltipBox, TooltipWrapper } from './styles';
import { AuthorsTotalImp } from '@/services/CalculationsServices/CurrentAccountService/TotalsServices';

export interface DefaultTooltipImp {
  children: JSX.Element;
  typeValue?: boolean;
  text?: string;
  width?: number;
  withoutHoverColor?: boolean;
  interestTooltip?: PeriodImp[];
  authorsTooltip?: AuthorsTotalImp[];
  totalsTooltip?: AuthorsTotalImp[];
  indexTooltip?: MemCalcImp[];
  interestInfo?: boolean;
  interest?: MonetaryInterestImp;
  arrow?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  link?: string;
  minWidth?: string;
  isClick?: boolean;
}

export const getIndexComposition = (memCalc: MemCalcImp) => {
  const dateEnd = memCalc.mecenda || new Date();
  const dateStart = memCalc.mecstarta;

  return `${memCalc.mecnome} de ${capitalize(moment(dateStart, 'YYYY-MM-DD').format('MMMM'))} de ${moment(
    dateStart,
    'YYYY-MM-DD'
  ).format('YYYY')} até ${capitalize(moment(dateEnd, 'YYYY-MM-DD').format('MMMM'))} de ${moment(
    dateEnd,
    'YYYY-MM-DD'
  ).format('YYYY')}`;
};

const DefaultTooltip: React.FC<DefaultTooltipImp> = ({
  children,
  arrow = true,
  placement = 'bottom',
  indexTooltip,
  interest,
  interestInfo,
  interestTooltip,
  authorsTooltip,
  totalsTooltip,
  text,
  typeValue,
  link,
  minWidth,
  isClick = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [adjustedPlacement, setAdjustedPlacement] = useState(placement);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClick = () => setVisible(isVisible => !isVisible);
  const handleMouseLeave = () => setVisible(false);
  const handleMouseEnter = () => setVisible(true);

  const adjustTooltipPosition = () => {
    const tooltip = tooltipRef.current;
    const wrapper = wrapperRef.current;

    if (tooltip && wrapper) {
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      if (tooltipRect.right > viewportWidth) {
        setAdjustedPlacement('left');
      } else if (tooltipRect.left < 0) {
        setAdjustedPlacement('right');
      } else if (tooltipRect.top < 0) {
        setAdjustedPlacement('bottom');
      } else if (tooltipRect.bottom > viewportHeight) {
        setAdjustedPlacement('top');
      } else {
        setAdjustedPlacement(placement);
      }
    }
  };

  useEffect(() => {
    if (visible) document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [visible, handleClick]);

  useEffect(() => {
    if (visible) adjustTooltipPosition();
  }, [visible]);

  const getInterestText = (period: any): string => {
    if (typeValue)
      return `${period.nomenclature} de ${period.from} até ${period.to} = R$ ${period.percentage.toFixed(2)}`;

    return `${period.nomenclature} de ${period.from} até ${period.to} = ${period.percentage.toFixed(6)} %`;
  };

  const getAuthorsText = (authors: AuthorsTotalImp[]) => {
    return (
      <TableAuthor>
        <TableBodyAuthor>
          {authors.map((description, index) => (
            <RowAuthor key={index}>
              <ColumnAuthor $type="title">
                {index == authors.length - 1 || index == 0 ? '' : `${index}-`}
                {description.title}
              </ColumnAuthor>
              <ColumnAuthor $type="total">{description.total ? description.total : ''}</ColumnAuthor>
            </RowAuthor>
          ))}
        </TableBodyAuthor>
      </TableAuthor>
    );
  };

  const renderTooltipText = () => {
    if (interestTooltip) {
      return interestTooltip.map((period: PeriodImp, index: number) => (
        <p key={`tooltip-data-${index}`}>{getInterestText(period)}</p>
      ));
    }

    if (authorsTooltip?.length || totalsTooltip?.length) {
      return getAuthorsText(authorsTooltip?.length ? authorsTooltip : totalsTooltip || []);
    }

    if (indexTooltip) {
      return indexTooltip.map((memCalc: MemCalcImp, index: number) => (
        <p key={`tooltip-data-${index}`}>{getIndexComposition(memCalc)}</p>
      ));
    }

    if (interestInfo && interest) {
      const interestType = interest.type === 'compound' ? '- Juros Composto' : '- Juros Simples';
      const markedInterests = getMarkedInterest(interest);
      let civilCodeType = '';

      if (interest.civilCode !== CivilCodeInterest.NOT_APPLY) {
        civilCodeType = getCivilCodeType(interest, true);
      }

      return (
        <>
          <p>- Sobre:</p>
          {markedInterests.map((marked: string) => (
            <p key={marked}>{marked}</p>
          ))}
          <p>- {civilCodeType}</p>
          <p>{interestType}</p>
        </>
      );
    }

    return text?.split('\n').map((txt, key) => {
      const text = txt.includes(':') ? txt.split(':') : [];

      const title = text[0];
      const content = txt.includes(':') ? text[1] : txt;

      return (
        <p key={key}>
          <b>{`${title || ''}${title ? ': ' : ''}`}</b>
          {content}
        </p>
      );
    });
  };

  return (
    <TooltipWrapper
      className="tooltip-container"
      ref={wrapperRef}
      onClick={isClick ? handleClick : undefined}
      onMouseEnter={!isClick ? handleMouseEnter : undefined}
      onMouseLeave={!isClick ? handleMouseLeave : undefined}>
      {children}
      {text ||
      interestTooltip?.length ||
      (interestInfo && interest) ||
      authorsTooltip?.length ||
      totalsTooltip?.length ? (
        <>
          {visible && (
            <TooltipBox $minWidth={minWidth} ref={tooltipRef} $placement={adjustedPlacement} $arrow={arrow}>
              <span>
                {renderTooltipText()}
                {link && (
                  <a target="_blank" rel="noopener noreferrer" href={link}>
                    Mais informações
                  </a>
                )}
              </span>
              {arrow && <Arrow $placement={adjustedPlacement} />}
            </TooltipBox>
          )}
        </>
      ) : (
        <Fragment />
      )}
    </TooltipWrapper>
  );
};

export default DefaultTooltip;
