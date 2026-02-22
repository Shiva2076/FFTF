'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Divider, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';

import MyProfile from './tabs/MyProfile';
import SubscriptionBilling from './tabs/SubscriptionBilling';
import FarmSetting from './tabs/FarmSettings';
import Security from './tabs/Security';
import AccountActions from './tabs/AccountActions';
import RolesAndPermissions from './tabs/RolesAndPermissions';

import { api } from '@/constants';
import { setCredentials, logout } from '../slices/authSlice';
import type { RootState } from '../store';

const getPrimarySections = () => [
  'My Profile',
  'Roles And Permissions',
  'Security',
  'Subscription & Billing',
  'Farm Settings',
  'Account Actions',
];

const getSecondarySections = () => [
  'My Profile',
  'Security',
  'Account Actions',
];

function AccountSettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const router = useRouter();
  const dispatch = useDispatch();

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [activeSection, setActiveSection] = useState('My Profile');
  const [userData, setUserData] = useState<any>(null);
  const [farmSelected, setFarmSelected] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
    useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const storedUserInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
        if (!token) {
          console.log('❌ No token found, redirecting to markettrend');
          router.replace('/markettrend');
          return;
        }

        if (userInfo && userInfo.user_id) {
          
          setUserData(userInfo);
          const userType = userInfo.user_type || 'primary';
          
          if (userType === 'primary' || !userInfo.user_type) {
            setSections(getPrimarySections());
          } else {
            setSections(getSecondarySections());
          }
          
          setIsLoading(false);
          return;
        }

        if (storedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storedUserInfo);            
            if (parsedUserInfo && parsedUserInfo.user_id) {
              setUserData(parsedUserInfo);
              dispatch(setCredentials(parsedUserInfo));
              const userType = parsedUserInfo.user_type || 'primary';
              
              if (userType === 'primary' || !parsedUserInfo.user_type) {
                setSections(getPrimarySections());
              } else {
                setSections(getSecondarySections());
              }
              
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error('❌ Failed to parse stored userInfo:', e);
          }
        }

        const response = await api.get('/api/users/profile');
        let fetchedUserData = null;
        if (response.data.user) {
          fetchedUserData = response.data.user;
        } else if (response.data.data) {
          fetchedUserData = response.data.data;
        } else if (response.data.user_id) {
          fetchedUserData = response.data;
        }
     if (fetchedUserData && fetchedUserData.user_id) {
          if (!fetchedUserData.user_type) {
            fetchedUserData.user_type = 'primary';
          }
          
          setUserData(fetchedUserData);
          dispatch(setCredentials(fetchedUserData));
          localStorage.setItem('userInfo', JSON.stringify(fetchedUserData));
          const userType = fetchedUserData.user_type;
          
          if (userType === 'primary') {
            setSections(getPrimarySections());
          } else {
            setSections(getSecondarySections());
          }
        } else {
          throw new Error('Invalid user data');
        }

      } catch (error: any) {
        console.error('❌ Auth check failed:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error?.response?.status,
          data: error?.response?.data
        });
        
        if (error?.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          dispatch(logout());
          router.replace('/markettrend');
        } else {
          const storedUserInfo = localStorage.getItem('userInfo');
          if (storedUserInfo) {
            try {
              const parsedUserInfo = JSON.parse(storedUserInfo);
              if (parsedUserInfo && parsedUserInfo.user_id) {
                if (!parsedUserInfo.user_type) {
                  parsedUserInfo.user_type = 'primary';
                }
                
                setUserData(parsedUserInfo);
                dispatch(setCredentials(parsedUserInfo));
                
                if (parsedUserInfo.user_type === 'primary') {
                  setSections(getPrimarySections());
                } else {
                  setSections(getSecondarySections());
                }
              }
            } catch (e) {
              console.error('❌ Failed to use cached data:', e);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) {
      checkAuthAndFetchUser();
    }
  }, [isMounted, dispatch, router]);

  useEffect(() => {
    if (tabParam === 'AccountActions') {
      setActiveSection('Account Actions');
    }
  }, [tabParam]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/users/profile');
      let fetchedUserData = null;
      if (response.data.user) {
        fetchedUserData = response.data.user;
      } else if (response.data.data) {
        fetchedUserData = response.data.data;
      } else if (response.data.user_id) {
        fetchedUserData = response.data;
      }

      if (fetchedUserData && fetchedUserData.user_id) {
        if (!fetchedUserData.user_type) {
          fetchedUserData.user_type = 'primary';
        }
        
        setUserData(fetchedUserData);
        dispatch(setCredentials(fetchedUserData));
        localStorage.setItem('userInfo', JSON.stringify(fetchedUserData));
      }
    } catch (error) {
      console.error('❌ Failed to refresh user data', error);
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setFarmSelected(false);
    if (section === 'Account Actions') {
      router.push('/accountsettings?tab=AccountActions');
    } else {
      router.push('/accountsettings');
    }
  };

  const renderRightPanel = () => {
    switch (activeSection) {
      case 'My Profile':
        return <MyProfile userData={userData} reloadUser={fetchUserData} />;
      case 'Roles And Permissions':
        const canViewRoles = userData?.user_type === 'primary' || !userData?.user_type;
        return canViewRoles ? <RolesAndPermissions /> : null;
      case 'Subscription & Billing':
        const canViewBilling = userData?.user_type === 'primary' || !userData?.user_type;
        return canViewBilling ? <SubscriptionBilling /> : null;
      case 'Farm Settings':
        const canViewFarm = userData?.user_type === 'primary' || !userData?.user_type;
        return canViewFarm ? (
          <Box sx={{ width: '100%' }}>
            <FarmSetting onFarmSelected={setFarmSelected} />
          </Box>
        ) : null;
      case 'Security':
        return <Security />;
      case 'Account Actions':
        return <AccountActions />;
      default:
        return <MyProfile userData={userData} reloadUser={fetchUserData} />;
    }
  };
 if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
        }}
      >
        <CircularProgress sx={{ color: '#FF5E00' }} />
      </Box>
    );
  }

  if (!userData?.user_id && !userInfo?.user_id) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8f9fa',
        }}
      >
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Unable to load user data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please try logging in again
          </Typography>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '8px 16px',
              background: '#FF5E00',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go to Login
          </button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            bgcolor: 'white',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {!farmSelected && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    color: '#111827',
                    mb: 1,
                  }}
                >
                  {activeSection === 'Roles And Permissions' ? 'User Management' : 'Account Settings'}
                </Typography>
              </Box>
              <Divider sx={{ mb: 4, borderColor: '#e5e7eb' }} />
            </>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: farmSelected ? 'column' : 'row' },
              gap: 4,
              alignItems: 'flex-start',
            }}
          >
            {!farmSelected && sections.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  width: { xs: '100%', lg: 280 },
                  flexShrink: 0,
                  p: 0,
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  bgcolor: 'white',
                  overflow: 'hidden',
                }}
              >
                <Stack spacing={0}>
                  {sections.map((item) => (
                    <Box
                      key={item}
                      onClick={() => handleSectionChange(item)}
                      sx={{
                        px: 3,
                        py: 2.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: activeSection === item ? '#fef3f2' : '#f9fafb',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: activeSection === item ? '#ea580c' : '#374151',
                          fontWeight: activeSection === item ? 600 : 500,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            <Box
              sx={{
                flex: 1,
                width: { xs: '100%', lg: 'auto' },
                minWidth: 0,
                minHeight: 300,
              }}
            >
              {renderRightPanel()}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
export default AccountSettingsPage;