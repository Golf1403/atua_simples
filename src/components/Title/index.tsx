import React from 'react';
import { Container, Text } from './styles';
import { IconType } from 'react-icons';
import DefaultTooltip from '../DefaultTooltip';
import TotalsService, { AuthorsTotalImp } from '@/services/CalculationsServices/CurrentAccountService/TotalsServices';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';

interface IProps extends React.DOMAttributes<HTMLButtonElement> {
  title: string;
  Icon?: IconType;
  isAuthor?: boolean;
  authors?: CurrentAuthorImp[];
  totalsTooltip?: AuthorsTotalImp[];
  updateTo?: string;
  uppercase?: boolean;
}

const Title = ({
  updateTo,
  title,
  Icon,
  onClick,
  authors,
  totalsTooltip,
  isAuthor,
  uppercase = true,
}: IProps): JSX.Element => {
  const getAuthorOverview = () => {
    if (!isAuthor) return [];
    const totalService = new TotalsService({
      authors,
      updateTo,
    });
    return totalService.run({ isFullAuthors: true }) as AuthorsTotalImp[];
  };

  const displayTitle = uppercase ? title.toLocaleUpperCase() : title;
  const titleContent = <Text>{displayTitle}</Text>;

  return (
    <Container type="button" onDoubleClick={onClick}>
      {Icon ? <Icon className="icon-title" /> : <></>}
      {isAuthor ? (
        <DefaultTooltip authorsTooltip={getAuthorOverview()}>{titleContent}</DefaultTooltip>
      ) : totalsTooltip?.length ? (
        <DefaultTooltip totalsTooltip={totalsTooltip}>{titleContent}</DefaultTooltip>
      ) : (
        titleContent
      )}
    </Container>
  );
};

export default Title;
