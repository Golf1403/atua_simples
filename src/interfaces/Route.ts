import { FC, LazyExoticComponent, PropsWithChildren } from 'react';
import { RouteComponentProps } from 'react-router-dom';
export type FCC<P = {}> = FC<PropsWithChildren<P>>;

export default interface Route {
  path: string;
  exact: boolean;
  auth: boolean;
  groups: string[];
  component: LazyExoticComponent<FCC<RouteComponentProps | any>>;
}
