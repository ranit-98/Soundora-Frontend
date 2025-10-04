import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { fetchMessages, fetchUsers } from '../functions/users';


export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
  });
};

export const useMessages = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.messages(userId),
    queryFn: () => fetchMessages(userId),
    enabled: !!userId,
  });
};