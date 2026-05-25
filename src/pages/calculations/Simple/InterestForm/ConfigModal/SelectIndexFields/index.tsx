import React, { Fragment } from 'react';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { useFormikContext } from 'formik';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import CustomSelect from '@/components/CustomSelect';
import nccRulesOptions from '@/data/calculations/nccRulesOptions';
import { typePeriod } from '@/data/calculations/interestTypes';
import { useFactors } from '@/hooks/factors';
import { mapIndexList } from '@/lib/utils';
import SelectOptionImp from '@/interfaces/SelectOptionImp';
import IndexFlags from '@/enums/IndexFlags';
import CustomCheckbox from '@/components/CustomCheckbox';
import { Box, CustomCheckboxContainer, Tooltip } from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import MemCalcImp from '@/interfaces/MemCalcImp';
import { getIndexComposition } from '@/components/DefaultTooltip';
import { typeFine } from '@/hooks/interfaces/CurrentAccountHookImp';

const SelectIndexFields = (): JSX.Element => {
  const { values, setFieldValue } = useFormikContext<CurrentInterestFineImp>();
  const { getIndexes, allMemcalcs } = useFactors();
  const [memCalcs, setMemCalcs] = React.useState<MemCalcImp[]>([]);
  const indexes = getIndexes();
  const [showHint, setShowHint] = React.useState<boolean>();
  const [hint, setHint] = React.useState<string>();

  const isSelectIndex: boolean = values.civilCode === CivilCodeInterest.SELECT_INDEX;
  if (values.description === typePeriod.value) return <Fragment />;

  const getIndexOptions = () => {
    const mappedIndexList = mapIndexList(indexes, IndexFlags.JUROS_DO_SISTEMA);
    const selectList: SelectOptionImp[] = mappedIndexList.map((calcIndex, key) => {
      const calcIndexOpton: any = {
        id: key,
        label: calcIndex.name,
        value: calcIndex.id,
        visibility: calcIndex.disp,
      };
      return calcIndexOpton;
    });

    let newSelectList: SelectOptionImp[] = [];
    const disableIndexes = [0];

    newSelectList = selectList.filter(_selected => !disableIndexes.includes(Number(_selected.value)));
    const withoutCorrectionIndexOption = {
      id: '-1',
      label: 'Sem correcao',
      value: '-1',
    };

    selectList.unshift(withoutCorrectionIndexOption);
    return newSelectList;
  };

  const options = getIndexOptions();

  React.useEffect(() => {
    if (memCalcs?.length) {
      const newMemCalc: string[] = [];
      memCalcs.forEach(memCalc => {
        newMemCalc.push(getIndexComposition(memCalc));
      });

      setHint(newMemCalc.join('\n'));
    } else {
      setHint('');
    }
  }, [memCalcs, hint, showHint, setHint]);

  React.useEffect(() => {
    try {
      if (!allMemcalcs) throw 'not found memcalcs';
      if (!values.index) {
        setFieldValue('index', options[0].value);
        return;
      }

      const _memCalcs = allMemcalcs?.[Number(values.index)];
      setMemCalcs(_memCalcs || []);
    } catch (error) {
      console.log(error);
    }
  }, [values.index]);

  if (isSelectIndex)
    return (
      <Fragment>
        <CustomSelect
          label="Formula"
          id="addInterestFormula"
          name="formula"
          value={values.formula}
          placeholder="Selecionar"
          options={nccRulesOptions}
        />
        <Box>
          <Tooltip withoutHoverColor={true} text={hint}>
            <CustomSelect
              label={labelsEnum.INDEX}
              id="addInterestIndex"
              name="index"
              value={values.index}
              placeholder="Selecionar"
              options={options}
              onMouseOver={() => setShowHint(!showHint)}
              onMouseOut={() => setShowHint(!showHint)}
            />
          </Tooltip>
          {values.type != typeFine.id ? (
            <Tooltip
              withoutHoverColor={true}
              text={'Suspende a correcao monetaria no periodo em que se aplica o indice nos juros'}>
              <CustomCheckboxContainer>
                <CustomCheckbox
                  checkboxSize="20px"
                  label="Sem Correcao"
                  checked={values.onInterestWithoutCorrection}
                  id="onInterestWithoutCorrection"
                  name="onInterestWithoutCorrection"
                />
              </CustomCheckboxContainer>
            </Tooltip>
          ) : (
            <Fragment />
          )}
        </Box>
      </Fragment>
    );

  return <Fragment />;
};
export default SelectIndexFields;
