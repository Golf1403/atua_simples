import { DataTableCellImp } from '@interfaces/DataTableImp';
import UserAdminResponseImp from '@interfaces/serviceResponses/UserAdminResponseImp';

export default class ListUserTransformer {
  public static output(data: UserAdminResponseImp) {
    const users = data.inUseLicenses.map(license => {
      return license.user;
    });

    const withoutUsers = data.avaibleLicenses.map(license => {
      const users: DataTableCellImp = {
        email: 'Email não vinculado',
        firstName: 'Nome não vinculado',
        id: license.id,
        lastName: '',
        createdAt: license.createdAt,
        licenseId: license.licenseId,
      };
      return users;
    });

    return {
      avaibleLicenses: data.avaibleLicenses,
      avaible: data.avaible,
      allLicenses: [...users, ...withoutUsers],
      inUse: data.inUse,
      inUseLicenses: data.inUseLicenses,
      total: data.total,
    };
  }
}
