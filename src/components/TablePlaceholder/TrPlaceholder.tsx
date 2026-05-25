import React from 'react';

interface IProps {
  numberOfSkeletons: number;
  index: number;
}

const TrPlaceholder = ({ numberOfSkeletons, index }: IProps) => {
  const columns = new Array(numberOfSkeletons).fill(0);

  return (
    <tr key={`data-row-${index}`}>
      {columns.map((column, key) => {
        return (
          <td height={40} key={index + key}>
            <span />
          </td>
        );
      })}
    </tr>
  );
};

export default TrPlaceholder;
