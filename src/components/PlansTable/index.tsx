import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { ApplicationState } from '@store/index';
import PlanTypeImp from '@interfaces/plans/PlanTypeImp';
import PlanResourceImp from '@interfaces/plans/PlanResourceImp';
import {
  CalcDesc,
  Container,
  CounterContainer,
  FeatureColumn,
  FeatureRow,
  FeaturesList,
  FrequencyContainer,
  FrequencyRadioContainer,
  Header,
  HeaderContainer,
  Label,
  PlanCard,
  PlanContainer,
  Section,
  TotalDesc,
  UserContainer,
} from './styles';
import { valueWithCurrency } from '@/lib/currency';
import { MdBlock } from 'react-icons/md';
import { IoMdCheckmark } from 'react-icons/io';
import { useFormikContext } from 'formik';

interface ValueImp {
  usersQuantity: number;
  frequencyId: string;
  plan: null | PlanTypeImp;
}

const PlansTable = (): JSX.Element => {
  const { setFieldValue, values } = useFormikContext<ValueImp>();
  const { frequencies, selectedFrequency } = useSelector((state: ApplicationState) => state.plans);
  const [planHover, setPlanHover] = useState('');

  useEffect(() => {
    if (values.plan && values.plan.value === 0 && values.usersQuantity > 1) setFieldValue('usersQuantity', 1);
  }, [values.plan, values.usersQuantity]);

  const increaseUsers = () => {
    setFieldValue('usersQuantity', values.usersQuantity + 1);
  };

  const decreaseUsers = () => {
    const newQuantity = Math.max(values.usersQuantity - 1, 1);
    setFieldValue('usersQuantity', newQuantity);
  };

  const listFrequencies = () => {
    const { frequenciesList } = frequencies;
    if (!frequenciesList.length) return <></>;

    return (
      <>
        <label>Frequência:</label>
        <FrequencyRadioContainer>
          {frequenciesList.map(frequency => {
            const { id, description } = frequency;
            return (
              <Label $isActive={id === values.frequencyId} key={id}>
                <input
                  type="radio"
                  name="billingFrequency"
                  value={id}
                  checked={values.frequencyId === id}
                  onChange={() => setFieldValue('frequencyId', id)}
                />
                <span>{description}</span>
              </Label>
            );
          })}
        </FrequencyRadioContainer>
      </>
    );
  };

  const renderPlansHeaders = () => {
    if (!selectedFrequency.plans.length) return <></>;

    return selectedFrequency.plans.map((plan: PlanTypeImp, key) => {
      return (
        <PlanCard
          onClick={async () => {
            await setFieldValue('plan', plan);
          }}
          $isHovered={planHover === plan.id}
          $isSelected={values.plan ? values.plan.id === plan.id : undefined}
          key={key}
          onMouseEnter={() => setPlanHover(plan.id)}
          onMouseLeave={() => setPlanHover('')}>
          <div>
            <h3>{plan.description}</h3>
            {values.plan && values.plan.id.includes(plan.id) ? (
              <CalcDesc>
                <p>{valueWithCurrency('R$', plan.value || 0)} +</p>
                <p>
                  {values.usersQuantity}x {valueWithCurrency('R$', plan.additionalValue || 0)}
                </p>
              </CalcDesc>
            ) : (
              <Fragment />
            )}

            <TotalDesc>
              {valueWithCurrency('R$', plan.value + (plan.additionalValue || 0) * values.usersQuantity)}
            </TotalDesc>
            {values.plan && values.plan.id === plan.id ? <div>Plano selecionado</div> : <></>}
          </div>
        </PlanCard>
      );
    });
  };

  const renderFeatureColumn = (resourcePlan: PlanResourceImp) => {
    if (typeof resourcePlan?.limit === 'boolean') {
      if (resourcePlan?.limit) return <IoMdCheckmark color="green" />;
      else return <MdBlock color="red" />;
    }
    if (Number(resourcePlan.limit) > 998) return <p className="unlimited-resource">ILIMITADO</p>;
    return <p className="limited-resource">{resourcePlan.limit}</p>;
  };

  const renderResourceByPlan = () =>
    selectedFrequency.resourcesList.map((resource: PlanResourceImp, key) => {
      const { id: resourceId, description } = resource;

      return (
        <FeatureRow key={key}>
          <FeatureColumn>{description}</FeatureColumn>

          {selectedFrequency.plans.map((plan: PlanTypeImp, key) => {
            const { resources, id: planId } = plan;
            const resourcePlan = resources.find(item => item.id === resourceId);

            return (
              <FeatureColumn
                onMouseEnter={() => setPlanHover(planId)}
                onMouseLeave={() => setPlanHover('')}
                key={planId}>
                {resourcePlan ? renderFeatureColumn(resourcePlan) : ''}
              </FeatureColumn>
            );
          })}
        </FeatureRow>
      );
    });

  const renderPlansFeatures = () => {
    if (!selectedFrequency.plans.length || !values.plan?.id) {
      return <></>;
    }

    const resources = renderResourceByPlan();

    return (
      <Fragment>
        <FeatureRow>
          <FeatureColumn>Descrição</FeatureColumn>
          {selectedFrequency.plans.map((plan: PlanTypeImp, key) => {
            return <FeatureColumn key={plan.id}>{plan.description}</FeatureColumn>;
          })}
        </FeatureRow>

        {resources}
      </Fragment>
    );
  };
  return (
    <Container>
      <HeaderContainer>
        <Header>
          <FrequencyContainer>{listFrequencies()}</FrequencyContainer>
          <UserContainer>
            <label>Quantidade de usuários:</label>
            <CounterContainer>
              <button
                type="button"
                disabled={values.usersQuantity == 1 || values.plan?.value == 0}
                onClick={decreaseUsers}>
                <FaMinus />
              </button>
              <div>{values.usersQuantity}</div>
              <button type="button" disabled={values.plan?.value == 0} onClick={increaseUsers}>
                <FaPlus />
              </button>
            </CounterContainer>
          </UserContainer>
        </Header>
      </HeaderContainer>

      {selectedFrequency.plans.length ? (
        <Section>
          <PlanContainer>{renderPlansHeaders()}</PlanContainer>
          <FeaturesList>{renderPlansFeatures()}</FeaturesList>
        </Section>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default PlansTable;
