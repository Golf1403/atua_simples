import { IconType } from 'react-icons';

export default interface AsideMenuLinkImp {
  pageUrl: string;
  pageName: string;
  group: string;
  groups: string[];
  action: string;
  subject: string;
}

export interface AsideMenuSectionImp {
  title: string;
  slug: string;
  pages: AsideMenuLinkImp[];
  groups: string[];
  icon?: IconType;
}
