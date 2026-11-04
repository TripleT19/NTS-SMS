import { useAuth } from '@/providers/AuthProvider';

export function usePermissions() {
  const { can, roles, permissions } = useAuth();
  return { can, roles, permissions };
}