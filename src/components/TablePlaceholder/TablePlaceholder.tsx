import React, { Fragment } from 'react';
import TrPlaceholder from './TrPlaceholder';

interface IProps {
  numberOfSkeletons?: number;
  lines?: number;
}

const TablePlaceholder = ({ numberOfSkeletons = 3, lines = 4 }: IProps) => {
  const rows: JSX.Element[] = [];

  for (let i = 0; i < lines; i++) {
    rows.push(<TrPlaceholder key={i} numberOfSkeletons={numberOfSkeletons} index={i} />);
  }

  return <Fragment>{rows}</Fragment>;
};

export default TablePlaceholder;
