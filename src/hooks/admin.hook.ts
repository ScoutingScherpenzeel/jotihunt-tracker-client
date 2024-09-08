import { del, fetcherWithMethod, useAuthSWR, User } from '@/api';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useSWR from 'swr';

export const useAdmin = () => {
  const { data, error, mutate } = useAuthSWR<User[]>('/admin/users');
  const authHeader = useAuthHeader();

  async function updateUser(user: User) {
    const { data } = await fetcherWithMethod(`/admin/users/${user._id}`, authHeader || '', 'PUT', user);
    mutate();
    return data;
  }

  async function deleteUser(id: string) {
    const { data } = await fetcherWithMethod(`/admin/users/${id}`, authHeader || '', 'DELETE');
    mutate();
    return data;
  }

  async function createUser(user: User) {
    const { data } = await fetcherWithMethod('/admin/users', authHeader || '', 'POST', user);
    mutate();
    return data;
  }

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    updateUser,
    deleteUser,
    createUser,
  };
};
