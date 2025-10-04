import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { fetchUserDetails } from '../functions/users';


export const useUserDetails = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.userDetails(userId),
    queryFn: () => fetchUserDetails(userId),
    enabled: !!userId,
  });
};

