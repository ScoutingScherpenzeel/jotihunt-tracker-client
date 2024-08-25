import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

export const useAuth = () => {
  const baseUrl = import.meta.env.API_BASE_URL;

  const signIn = useSignIn();

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

    const signinResult = signIn({
      auth: {
        token,
        type: "Bearer",
      },
    });

    return signinResult;
  }

  return {
    login,
  };
};
