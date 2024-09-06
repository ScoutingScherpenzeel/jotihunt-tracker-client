import { User } from '@/api';
import axios from 'axios';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

export const useAuth = () => {
  const baseUrl = import.meta.env.API_BASE_URL;

  const signIn = useSignIn();

  /**
   * Tries to login with the given credentials.
   * Also signs in the user with the returned token.
   * @param email The email address to login with
   * @param password The password to login with
   * @returns True if the login was successful, false otherwise
   */
  async function login(email: string, password: string): Promise<boolean> {
    const response = await axios
      .post(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .catch((error) => {
        return error.response;
      });

    if (response.status !== 200) {
      return false;
    }

    const token = response.data.accessToken;

    if (!token) {
      return false;
    }

    const userState = response.data.user as User;

    const signinResult = signIn({
      auth: {
        token,
        type: 'Bearer',
      },
      userState: userState,
    });

    return signinResult;
  }

  return {
    login,
  };
};
