export default interface DashboardResponseImp {
  accounts: number;
  user: { users: number; connecteds: number };
  plan: { name: null | string; days: number; createdAt: null | Date };
  costCenters: number;
  visible: boolean;
}
