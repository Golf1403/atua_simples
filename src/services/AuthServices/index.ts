import { getErrorMessage } from '../http';
import ForgotPasswordResponseImp from '@interfaces/ForgotPasswordResponseImp';
import { getWitchEnv } from '../../utils/getWitchEnv';
import EmailConfirmationResponseImp from '@/interfaces/EmailConfirmationResponseImp';
import { useAuth } from '@/hooks/auth';
import BaseService from '../http/BaseService';
import { emailConfirmationPage, forgotPasswordPage } from '@/Routes/pages/auth';
import { UserImp } from '@/hooks/user';

class AuthServices extends BaseService {
  protected isProdMode: boolean = getWitchEnv();
  protected socketHook = useAuth();

  public resetPassword(payload: { confirmPassword: string; newPassword: string; token: string }) {
    return new Promise<ForgotPasswordResponseImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.post('/users/reset-password', payload);
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  }
  public forgotPassword(email: string) {
    return new Promise<ForgotPasswordResponseImp>(async (resolve, reject) => {
      const body = { email };
      try {
        const response = await this.axios.post(`/users${forgotPasswordPage.path}`, body);
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  }
  public async emailConfirmation(user: UserImp) {
    return new Promise<EmailConfirmationResponseImp>(async (resolve, reject) => {
      const body = { email: user.email };
      try {
        if (user?.isConfirmed) {
          throw new Error('E-mail já confirmado!');
        }
        const response = await this.axios.post(`/users${emailConfirmationPage.path}`, body);
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  }
}
export default AuthServices;
