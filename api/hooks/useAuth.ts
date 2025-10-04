import { useQuery } from '@tanstack/react-query';
import { checkAdminStatus } from '../functions/auth';
import { QUERY_KEYS } from '@/lib/queryKeys';


export const useIsAdmin = () => {
  return useQuery({
    queryKey: QUERY_KEYS.isAdmin,
    queryFn: checkAdminStatus,
  });
};