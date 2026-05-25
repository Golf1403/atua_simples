import AccountImp from '@/interfaces/AccountImp';
import { MemCalcHasFactorsImp } from '@/store/simple/types';

const findPositionIndexFromMemCalcHasFactors = ({
  memCalcHasFactors = [],
  account,
}: {
  memCalcHasFactors: MemCalcHasFactorsImp[];
  account: AccountImp;
}) => {
  const indexId = Number(account.indexId);

  const indexIdFromMemCalc = memCalcHasFactors.findIndex(memCalcHasFactor => {
    return Number(memCalcHasFactor.indexId) == indexId;
  });
  return indexIdFromMemCalc;
};

export default findPositionIndexFromMemCalcHasFactors;
