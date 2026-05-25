import { UserImp } from '@/hooks/user';
import IDummyObject from '@/interfaces/IDummyObject';

export default class UserTransformer {
  public static output(user: IDummyObject): UserImp {
    return {
      id: user?.id,
      firstName: user?.firstName,
      licenseId: user?.licenseId,
      master: Boolean(user?.master),
      isConfirmed: Boolean(user?.isConfirmed),
      isAdmUser: Boolean(user?.isAdmUser),
      lastName: user?.lastName,
      redirectToPayment: Boolean(user?.redirectToPayment),
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      group: user?.master ? 'owner' : !user?.isAdmUser ? 'user' : 'admin',
      email: user?.email,
      costCenters: user?.costCenters,
    };
  }
}
