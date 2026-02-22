export interface UserInfo {
  user_id: string;
  user_account_id?: string; 
  original_user_id?: string;
  user_type?: 'primary' | 'secondary';
  role: string;
  username: string;
  email: string;
  phone_code?: string;
  phone_number?: string;
  language?: string;
  unit?: string; 
  timezone?: string;
  verified: boolean;
  active?: boolean;
  subscribed?: boolean;
  markettrendsubscribed: boolean;
  notificationsEnabled?: boolean;
  profile_image_url?: string;
  imageUrl?: string; 
  farm_account_id?: string;
  token?: string;
  usersubscription?: any[];
  created_date?: string;
  last_modified_date?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  countryCode?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  user_id: string;
  username?: string;
  email?: string;
  password?: string;
  phone_code?: string;
  phone_number?: string;
  language?: string;
  unit?: string;
  timezone?: string;
}

export interface UserProfileResponse {
  user_id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  phone_code?: string;
  phone_number?: string;
  language?: string;
  unit?: string;
  timezone?: string;
  imageUrl?: string;
  verified: boolean;
  subscribed?: boolean;
  notificationsEnabled?: boolean;
}

export interface AccountSettingsUpdateRequest {
  username?: string;
  email?: string;
  phone_code?: string;
  phone_number?: string;
  language?: string;
  unit?: string;
  timezone?: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}