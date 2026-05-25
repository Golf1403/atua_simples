import React, { Fragment, useState } from 'react';
import { Content, Tab, TabsContainer, Title } from './styles';

interface TabProps {
  title: string;
  content: React.ReactElement;
}
type TabsProps = TabProps[];

interface TabsImp {
  tabs: TabsProps;
  total?: number;
}

const Tabs = ({ tabs, total = 3 }: TabsImp) => {
  const [activeTab, setActiveTab] = useState(0);
  const TABS = new Array(total).fill(undefined);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Fragment>
      <TabsContainer>
        {TABS.map((_, index) => {
          return (
            <Tab
              key={index}
              $active={tabs[index] && activeTab === index}
              onClick={() => tabs[index] && handleTabClick(index)}>
              {tabs[index] && <Title title={tabs[index].title}></Title>}
            </Tab>
          );
        })}
      </TabsContainer>

      <Content>
        {TABS.map((_, index) => activeTab === index && tabs[index] && <div key={index}>{tabs[index].content}</div>)}
      </Content>
    </Fragment>
  );
};

export default Tabs;
