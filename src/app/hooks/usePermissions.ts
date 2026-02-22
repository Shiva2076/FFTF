import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { api } from '@/constants';
import type { RootState } from '../store';

interface Permissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface PermissionsHook {
  permissions: Permissions;
  loading: boolean;
  isPrimary: boolean;
  isFarmManager: boolean;
  isAgronomist: boolean;
  role: string | undefined;
  getNoPermissionMessage: (action: string) => string;
}

// Permission messages for different roles
const PERMISSION_MESSAGES: Record<string, Record<string, string>> = {
  'Farm Manager': {
    delete_cycle: "Farm Managers cannot delete crop cycles. Please contact an Admin.",
    edit_ai_params: "Farm Managers cannot edit AI-driven parameters. Please contact an Admin.",
    edit_irrigation: "Farm Managers cannot edit irrigation schedules. Please contact an Admin.",
    access_billing: "Farm Managers do not have access to billing. Please contact an Admin.",
    delete_user: "Farm Managers cannot delete users. Please contact an Admin."
  },
  'Agronomist / Grower': {
    delete_cycle: "Agronomists cannot delete crop cycles. Please send an access request to your Farm Manager.",
    create_cycle: "Agronomists cannot create new crop cycles. Please send an access request to your Farm Manager.",
    edit_shelf: "Agronomists cannot modify rack & shelf allocations. Please contact your Farm Manager.",
    edit_ai_params: "Agronomists cannot edit AI-driven parameters. Please contact your Farm Manager.",
    edit_irrigation: "Agronomists cannot edit irrigation schedules. Please contact your Farm Manager.",
    access_users: "Agronomists do not have access to user management. Please contact your Farm Manager.",
    access_settings: "Agronomists do not have access to settings. Please contact your Farm Manager.",
    access_billing: "Agronomists do not have access to billing. Please contact an Admin."
  }
};

export const usePermissions = (module: string): PermissionsHook => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  
  const [permissions, setPermissions] = useState<Permissions>({
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  });
  const [loading, setLoading] = useState(true);

  const user_type = userInfo?.user_type;
  const role = userInfo?.role;
  const isPrimary = user_type === 'primary' || !user_type;
  const isFarmManager = role === 'Farm Manager';
  const isAgronomist = role === 'Agronomist / Grower';

  useEffect(() => {
    const checkPermissions = async () => {
      // Primary users have all permissions
      if (isPrimary) {
        setPermissions({
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
        });
        setLoading(false);
        return;
      }

      // Secondary users - fetch permissions from API
      try {
        const response = await api.get(`/api/users/check-permission/${module}`);
        setPermissions(response.data.permissions);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setPermissions({
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        });
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.user_id) {
      checkPermissions();
    } else {
      setLoading(false);
    }
  }, [module, userInfo, isPrimary]);

  const getNoPermissionMessage = (action: string): string => {
    if (!role) return "You don't have permission to perform this action.";
    
    const messages = PERMISSION_MESSAGES[role];
    return messages?.[action] || "You don't have permission to perform this action.";
  };

  return {
    permissions,
    loading,
    isPrimary,
    isFarmManager,
    isAgronomist,
    role,
    getNoPermissionMessage,
  };
};