'use client';

import {
  Box, Typography, Paper, Button, Grid,
  TextField, MenuItem, Avatar, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import TimezoneSelect from 'react-timezone-select';
import { api } from "@/constants";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import LoadingSpinner from '@/components/LoadingSpinner';

export interface User {
  username: string;
  email: string;
  phone_code?: string;
  phone_number?: string;
  language?: string;
  timezone?: string;
  unit?: {
    temperature: string;
    weight: string;
    length: string;
  };
  imageUrl?: string;
}

interface MyProfileProps {
  userData: User | null;
  reloadUser: () => Promise<void>;
}

export default function MyProfile({ userData, reloadUser }: MyProfileProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone 
  );
  const [units, setUnits] = useState('Metric (°C, kg, cm)');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullNameRegex = /^[A-Za-z\s'-]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [pendingAction, setPendingAction] = useState<'changePicture'|'updateProfile'|null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const parseUnits = (unitLabel: string) => {
    if (unitLabel.includes('Metric')) {
      return { temperature: '°C', weight: 'kg', length: 'cm' };
    } else if (unitLabel.includes('Imperial')) {
      return { temperature: '°F', weight: 'lbs', length: 'in' };
    }
    return {};
  };

  const updateUserProfile = async () => {
    try {
      setUpdatingProfile(true);
      const payload = {
        username: fullName,
        email,
        phone_code: phoneCode,
        phone_number: phoneNumber,
        language,
        unit: parseUnits(units),
        timezone,
      };

      const response = await api.put(`api/users/account`, payload);
      await reloadUser();
      
      setShowUpdateSuccess(true);
    } catch (error) {
      console.error('Update Failed:', error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  useEffect(() => {

    console.log('=================================');
  console.log('🎯 MyProfile - userData received:');
  console.log('Full object:', userData);
  console.log('phone_code:', userData?.phone_code);
  console.log('phone_number:', userData?.phone_number);
  console.log('=================================');
    if (userData) {
      setFullName(userData.username || '');
      setEmail(userData.email || '');
      setPhoneCode(userData.phone_code || '');
      setPhoneNumber(userData.phone_number || '');
      setContactNumber(
        userData.phone_code && userData.phone_number
          ? `${userData.phone_code}${userData.phone_number}`
          : ''
      );
      setLanguage(userData.language || 'en-US');
      setTimezone(userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
      // Always append cache-busting query to imageUrl if present
       if (userData.imageUrl) {
        let imgUrl = userData.imageUrl;
        if (!imgUrl.includes('?')) {
          imgUrl += `?t=${Date.now()}`;
        }
        setProfileImage(
          imgUrl.startsWith('http') 
            ? imgUrl 
            : `${window.location.origin}${imgUrl}`
        );
      } else {
        setProfileImage(null);
      }

      const isImperial = userData.unit?.temperature === '°F';
      setUnits(isImperial ? 'Imperial (°F, lbs, in)' : 'Metric (°C, kg, cm)');
    }
    setInitialLoading(false);
  }, [userData]);  

  const uploadProfilePicture = async (file: File) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/api/users/upload-profile', 
        formData,
        {
        headers: { 'Content-Type': 'multipart/form-data'},
        withCredentials: true,
        });
      const url = (data.imageUrl.startsWith('http')
        ? data.imageUrl
        : `${window.location.origin}${data.imageUrl}`) + `?t=${Date.now()}`;
      
      await api.put('/api/users/account', { imageUrl: url });
      await reloadUser();
      
      setProfileImage(url);
      setShowSuccess(true);
      router.refresh();
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleDeleteProfileImage = async () => {
    try {
      setDeletingImage(true);
      await api.delete('/api/users/delete-profile-image');
      await reloadUser();
      setProfileImage(null);
      setShowDeleteDialog(false);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error('Failed to delete profile image', err);
    } finally {
      setDeletingImage(false);
    }
  };

  const validateFullName = (value: string) => {
    if (!fullNameRegex.test(value)) {
      setFullNameError('Only letters, spaces, hyphens, and apostrophes. Min 2, max 50 characters.');
    } else {
      setFullNameError('');
    }
    setFullName(value);
  };

  const validateEmail = (value: string) => {
      if (!emailRegex.test(value)) {
        setEmailError('Enter a valid email address.');
      } else {
        setEmailError('');
      }
      setEmail(value);
    };

    const validatePhone = (value: string, data: any) => {
    const dialCode = data.dialCode; 
    const rest = value.startsWith(dialCode) ? value.slice(dialCode.length) : value;

    if (rest.length < 6 || rest.length > 12) {
      setPhoneError('Phone number must be 6–12 digits (excluding country code).');
    } else {
      setPhoneError('');
    }

    setPhoneCode(dialCode);
    setPhoneNumber(rest);
    setContactNumber(value); 
  };
  const isFormValid = !fullNameError && !emailError && !phoneError && fullName && email && contactNumber;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
              elevation={0}
              sx={{
                px: 3,
                py: 2,
                border: '1px solid #d1d5db',
                overflow: 'hidden',
                borderRadius: '8px 8px 0 0',
              }}
            >  <Typography variant="h6" fontWeight={600}>My Profile</Typography>  
            {showLoader || initialLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:"25%"}}>
            <LoadingSpinner />
          </Box>
        ) : null}   
      </Paper>    
      {!(showLoader || initialLoading) && (
        <>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
                setSelectedFile(file);
                setPreviewImage(URL.createObjectURL(file));
                setPendingAction('changePicture');
                setShowUpdateDialog(true);
                e.target.value = '';
            }}
          />         
          <Snackbar
            open={showSuccess}
            autoHideDuration={3000}
            onClose={() => setShowSuccess(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              variant="filled"
              sx={{
                bgcolor: '#EDF7ED',
                color: '#1E4620',
                fontFamily: 'Poppins',
                boxShadow: 'none',
                borderRadius: 1,
              }}
              iconMapping={{
                success: (
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      backgroundColor: '#2E7D32',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 18, color: '#fff' }}>✓</span>
                  </Box>
                ),
              }}
            >
              Profile Picture has been added
            </Alert>
          </Snackbar>
          <Snackbar
            open={showDeleteSuccess}
            autoHideDuration={3000}
            onClose={() => setShowDeleteSuccess(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setShowDeleteSuccess(false)}
              severity="success"
              variant="filled"
              sx={{
                bgcolor: '#EDF7ED',
                color: '#1E4620',
                fontFamily: 'Poppins',
                boxShadow: 'none',
                borderRadius: 1,
              }}
              iconMapping={{
                success: (
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      backgroundColor: '#2E7D32',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 18, color: '#fff' }}>✓</span>
                  </Box>
                ),
              }}
            >
              Photo has been removed
            </Alert>
          </Snackbar>

          <Snackbar
            open={showUpdateSuccess}
            autoHideDuration={3000}
            onClose={() => setShowUpdateSuccess(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setShowUpdateSuccess(false)}
              severity="success"
              variant="filled"
              sx={{
                bgcolor: '#EDF7ED',
                color: '#1E4620',
                fontFamily: 'Poppins',
                boxShadow: 'none',
                borderRadius: 1,
              }}
              iconMapping={{
                success: (
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      backgroundColor: '#2E7D32',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 18, color: '#fff' }}>✓</span>
                  </Box>
                ),
              }}
            >
              Your profile has been updated
            </Alert>
          </Snackbar>
          <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 20, color: '#008756' }}>
              Delete Profile Picture?
            </DialogTitle>

            <DialogContent sx={{ fontFamily: 'Poppins', fontSize: 16, color: 'rgba(0, 18, 25, 0.6)' }}>
              Are you sure you want to remove your profile picture? <br />
              If removed, your profile will display a default avatar.
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowDeleteDialog(false)}
                sx={{ textTransform: 'uppercase', fontFamily: 'Poppins' }}
                disabled={deletingImage}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteProfileImage}
                sx={{ textTransform: 'uppercase', fontFamily: 'Poppins' }}
                disabled={deletingImage}
              >
                {deletingImage ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Update Confirmation Dialog */}
          <Dialog open={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}>
            <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 20, color: '#008756' }}>
              Confirm Profile Update
            </DialogTitle>

            <DialogContent sx={{ fontFamily: 'Poppins', fontSize: 16, color: 'rgba(0, 18, 25, 0.6)' }}>
              You are about to update your profile details.
              Please review the changes before saving. <br />
              Would you like to proceed?
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowUpdateDialog(false);
                  setPendingAction(null);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
                sx={{ textTransform: 'uppercase', fontFamily: 'Poppins' }}
                disabled={uploadingImage || updatingProfile}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'uppercase',
                  fontFamily: 'Poppins',
                  bgcolor: '#FF5E00',
                  '&:hover': { bgcolor: '#e05200' },
                }}
               onClick={async () => {
                 setShowUpdateDialog(false);
                 if (pendingAction === 'changePicture' && selectedFile) {
                    await uploadProfilePicture(selectedFile);
                    setPreviewImage(null);
                    setSelectedFile(null);
                   } else if (pendingAction === 'updateProfile') {
                    await updateUserProfile();
                   }
                 setPendingAction(null);
               }}
               disabled={uploadingImage || updatingProfile}
              >
                {'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Main Profile Form */}
          <Paper elevation={0} sx={{
            p: 3,
            borderRadius: '0 0 8px 8px',
            border: '1px solid #d1d5db', 
            borderTop: 'none',
            bgcolor: 'white',
          }}>
            {/* Picture Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                src={previewImage ?? profileImage ?? undefined}
                sx={{ width: 88, height: 88 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {profileImage ? (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: '#FF5E00', textTransform: 'uppercase' }}
                      onClick={() => {
                        setPendingAction('changePicture');
                        fileInputRef.current?.click();
                      }}
                      disabled={uploadingImage || deletingImage}
                    >
                      {uploadingImage ? 'Uploading...' : 'Change'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={deletingImage || uploadingImage}
                    >
                      {deletingImage ? 'Deleting...' : 'Delete'}
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#FF5E00', textTransform: 'uppercase' }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage || deletingImage}
                  >
                    {uploadingImage ? 'Uploading...' : 'Add Picture'}
                  </Button>
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(0, 18, 25, 0.6)', 
                    fontFamily: 'Poppins',
                    fontSize: '12px',
                    fontWeight: 400
                  }}
                >
                  Max file size: 5 MB
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => validateFullName(e.target.value)}
                  error={!!fullNameError}
                  helperText={fullNameError}
                  disabled={updatingProfile}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  disabled={updatingProfile}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <PhoneInput
                  country={'in'}
                  value={contactNumber}
                  onChange={(value, data) => validatePhone(value, data)}
                  inputStyle={{ 
                    width: '100%', 
                    height: '56px',
                    opacity: updatingProfile ? 0.5 : 1,
                    pointerEvents: updatingProfile ? 'none' : 'auto'
                  }}
                  placeholder="Enter Contact Number"
                  enableSearch
                  disabled={updatingProfile}
                />
                {phoneError && (
                  <Typography variant="caption" color="error">{phoneError}</Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={updatingProfile}
                >
                  <MenuItem disabled value="">Select English Variant</MenuItem>
                  <MenuItem value="en-US">English (United States)</MenuItem>
                  <MenuItem value="en-UK">English (United Kingdom)</MenuItem>
                  <MenuItem value="en-IN">English (India)</MenuItem>
                  <MenuItem value="en-AU">English (Australia)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Units"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  disabled={updatingProfile}
                >
                  <MenuItem value="Metric (°C, kg, cm)">Metric (°C, kg, cm)</MenuItem>
                  <MenuItem value="Imperial (°F, lbs, in)">Imperial (°F, lbs, in)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TimezoneSelect
                  value={{ value: timezone, label: timezone }}
                  onChange={(tz) => setTimezone(tz.value)}
                  menuPosition="fixed"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                  isDisabled={updatingProfile}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 1300 }),
                    control: (base) => ({
                      ...base,
                      minHeight: 56,
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                      fontSize: 16,
                      fontFamily: 'Poppins',
                      borderRadius: 4,
                      opacity: updatingProfile ? 0.5 : 1,
                    }),
                  }}
                  placeholder="TimeZone"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              {updatingProfile ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <LoadingSpinner />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#FF5E00', textTransform: 'uppercase' }}
                  disabled={!isFormValid || updatingProfile}
                  onClick={() => {
                    setPendingAction('updateProfile');
                    setShowUpdateDialog(true);
                  }}
                >
                  Update
                </Button>
              )}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}