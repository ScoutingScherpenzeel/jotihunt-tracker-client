import { fetcherWithMethod, useAuthSWR } from '@/lib/swr';
import { User } from '@/types/User';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useFetcher } from './utils/api.hook';

export const useAdmin = () => {
  const { data, error, mutate } = useAuthSWR<User[]>('/admin/users');
  const authHeader = useAuthHeader();
  const { fetch } = useFetcher();

  async function updateUser(user: User): Promise<boolean> {
    // fetch the update function
    const result = await fetch(`/admin/users/${user._id}`, 'PUT', user);
    mutate();
    return result.status === 200;
  }

  async function deleteUser(id: string): Promise<boolean> {
    const result = await fetcherWithMethod(`/admin/users/${id}`, authHeader || '', 'DELETE');
    mutate();
    return result.status === 200;
  }

  async function createUser(user: User): Promise<boolean> {
    const result = await fetcherWithMethod('/admin/users', authHeader || '', 'POST', user);
    mutate();
    return result.status === 201;
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
