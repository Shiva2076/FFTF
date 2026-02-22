import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "./types/userTypes";
import Cookies from "js-cookie";

interface AuthState {
  userInfo: UserInfo | null;
  isLoading: boolean;
}

// Helper to transform user data from new system to UserInfo interface
const transformUserData = (userData: any): UserInfo | null => {
  if (!userData) {
    console.error('❌ transformUserData received null/undefined userData');
    return null;
  }

  // If it's already in UserInfo format, return as is
  if (userData.user_id && userData.verified !== undefined) {
    return userData;
  }

  // Extract user_id from various possible locations
  const user_id = userData.user_id ||
                  userData.original_user_id ||
                  userData.user_account_id?.toString() ||
                  userData.id;

  console.log('🔄 Extracted user_id:', user_id);

  if (!user_id) {
    console.error('❌ Could not extract user_id from userData:', {
      has_user_id: 'user_id' in userData,
      has_original_user_id: 'original_user_id' in userData,
      has_user_account_id: 'user_account_id' in userData,
      has_id: 'id' in userData,
      keys: Object.keys(userData)
    });
    return null;
  }

  // Transform new system user to UserInfo
  const transformed = {
    user_id,
    user_type: userData.user_type || userData.type || 'primary',
    username: userData.username || userData.name || userData.email,
    email: userData.email,
    role: userData.role,
    phone_code: userData.phone_code || '',
    phone_number: userData.phone_number || '',
    verified: userData.verified !== undefined ? userData.verified : true,
    markettrendsubscribed: userData.markettrendsubscribed || false,
    usersubscription: userData.usersubscription || [],
  };

  console.log('✅ Transformed user data:', transformed);
  return transformed;
};

// Get initial state from cookies AND localStorage (hybrid approach)
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return { userInfo: null, isLoading: false };
  }
  
  // Try to get token from localStorage (JWT tokens better in localStorage)
  const token = localStorage.getItem("token");
  
  // Try to get userInfo from cookies first (more secure), fallback to localStorage
  let userInfo: UserInfo | null = null;
  
  const userInfoCookie = Cookies.get("userInfo");
  if (userInfoCookie) {
    try {
      userInfo = JSON.parse(userInfoCookie);
    } catch (e) {
      console.error('Failed to parse userInfo cookie:', e);
    }
  }
  
  // Fallback to localStorage if cookie doesn't exist
  if (!userInfo) {
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        userInfo = JSON.parse(userInfoStr);
        // Migrate to cookie
        if (userInfo) {
          Cookies.set("userInfo", JSON.stringify(userInfo), { 
            expires: 7,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          });
        }
      } catch (e) {
        console.error('Failed to parse userInfo from localStorage:', e);
      }
    }
  }
  
  // If no token, clear everything
  if (!token && userInfo) {
    return { userInfo: null, isLoading: false };
  }
  
  return { userInfo, isLoading: false };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      const userData = action.payload;
      
      if (!userData || typeof userData !== 'object') {
        console.error('❌ setCredentials received invalid payload:', userData);
        return;
      }

      if (!userData.id && !userData.user_id && !userData.email) {
        console.error('❌ setCredentials received userData without id, user_id, or email:', userData);
        return;
      }

      const transformedUser = transformUserData(userData);
      
      if (transformedUser) {
        state.userInfo = transformedUser;

        if (typeof window !== "undefined") {
          // Store userInfo in cookies (more secure, SSR-friendly)
          Cookies.set("userInfo", JSON.stringify(transformedUser), { 
            expires: 7, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // HTTPS only in production
          });
          
          // Also keep in localStorage as backup for older code compatibility
          localStorage.setItem("userInfo", JSON.stringify(transformedUser));
        }
      } else {
        console.error('❌ Failed to transform user data, keeping current state');
        console.error('❌ Original userData was:', userData);
      }
    },
    
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
        
        // Update both cookie and localStorage
        if (typeof window !== "undefined") {
          Cookies.set("userInfo", JSON.stringify(state.userInfo), { 
            expires: 7,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          });
          localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
        }
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    logout: (state) => {
      state.userInfo = null;
      state.isLoading = false;
      
      if (typeof window !== "undefined") {
        // Clear cookies
        Cookies.remove("userInfo");
        
        // Clear localStorage
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        
        // Clear any persisted Redux state
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('persist:')) {
            localStorage.removeItem(key);
          }
        });
      }
    },
    
    rehydrateAuth: (state, action: PayloadAction<AuthState>) => {
      if (action.payload?.userInfo) {
        state.userInfo = action.payload.userInfo;
      }
    },
  },
});

export const { setCredentials, updateUserInfo, setLoading, logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;