import React, { useEffect, useCallback, useState } from 'react';

import { convertCurrencyToPtBr } from '@lib/currency';

interface IProps {
  total: number;
  type?: 'usersPage' | 'financingPage';
}

const TotalBottomBar = ({ total, type = 'financingPage' }: IProps) => {
  const [totalState, setTotalState] = useState(0);

  const getTotalData = useCallback(() => {
    switch (type) {
      case 'usersPage':
        return `${total}`;
      default:
        return convertCurrencyToPtBr(total);
    }
  }, [total, type]);

  useEffect(() => {
    if (total === totalState) return;
    setTotalState(total);
  }, [type, total]);

  return (
    <div>
      <h2>TOTAL</h2>
      <p>{getTotalData()}</p>
    </div>
  );
};

export default TotalBottomBar;
