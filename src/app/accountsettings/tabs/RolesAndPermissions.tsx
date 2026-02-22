'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  MenuItem,
  Grid,
  InputAdornment,
  Menu,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowDropDown as ArrowDropDownIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { api } from '@/constants';

interface User {
  user_account_id: string;
  username: string;
  email: string;
  role: string;
  image_url?: string;
  contact_number?: string;
  language?: string;
  created_date: string;
  created_by_name?: string;
}

const roles = ['Farm Manager', 'Agronomist / Grower'];
const languages = ['English', 'Spanish', 'French', 'German', 'Hindi'];

export default function RolesAndPermissions() {
  const [viewMode, setViewMode] = useState<'management' | 'create' | 'edit'>('management');
  const [users, setUsers] = useState<User[]>([]);
  const [filterText, setFilterText] = useState('');
  const [filterBy, setFilterBy] = useState<'name' | 'email' | 'role'>('name');
  const [editMenuAnchor, setEditMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [language, setLanguage] = useState('English');
  const [selectedRole, setSelectedRole] = useState('Agronomist / Grower');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/list');
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!filterText) return true;
    const searchText = filterText.toLowerCase();
    switch (filterBy) {
      case 'name':
        return user.username.toLowerCase().includes(searchText);
      case 'email':
        return user.email.toLowerCase().includes(searchText);
      case 'role':
        return user.role.toLowerCase().includes(searchText);
      default:
        return true;
    }
  });

  const handleAddNewUser = () => {
    setViewMode('create');
    setEditingUser(null);
    setFullName('');
    setEmail('');
    setContactNumber('');
    setLanguage('English');
    setSelectedRole('Agronomist / Grower');
    setPreviewImage(null);
  };

  const handleEditUser = (user: User) => {
    setViewMode('edit');
    setEditingUser(user);
    setFullName(user.username);
    setEmail(user.email);
    setContactNumber(user.contact_number || '');
    setLanguage(user.language || 'English');
    setSelectedRole(user.role);
    setPreviewImage(user.image_url || null);
    handleEditMenuClose();
  };

  const handleBackToManagement = () => {
    setViewMode('management');
    setEditingUser(null);
  };

  const handleEditClick = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setEditMenuAnchor(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleEditMenuClose = () => {
    setEditMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await api.delete(`/api/users/${selectedUserId}`);
      setSnackbarMessage('User deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchUsers();
      handleEditMenuClose();
    } catch (error: any) {
      console.error('Failed to delete user', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to delete user');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChangePicture = () => {
    fileInputRef.current?.click();
  };

  const handleCreateUser = async () => {
    if (!fullName || !email || !contactNumber) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setCreatingUser(true);
    try {
      const response = await api.post('/api/users/create', {
        username: fullName,
        email,
        contactNumber,
        language,
        role: selectedRole,
        imageUrl: previewImage,
      });

      setSnackbarMessage(response.data.message || 'User created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setTimeout(() => {
        handleBackToManagement();
        fetchUsers();
      }, 2000);

    } catch (error: any) {
      console.error('Failed to create user', error);
      const errorMessage = error.response?.data?.message || 'Failed to create user. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !fullName || !contactNumber) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setCreatingUser(true);
    try {
      const response = await api.put(`/api/users/${editingUser.user_account_id}`, {
        username: fullName,
        // email: NOT sent (cannot be changed)
        contactNumber,
        language,
        role: selectedRole,
        imageUrl: previewImage,
      });

      setSnackbarMessage(response.data.message || 'User updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setTimeout(() => {
        handleBackToManagement();
        fetchUsers();
      }, 2000);

    } catch (error: any) {
      console.error('Failed to update user', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #d1d5db',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography 
          variant="h6" 
          fontWeight={600} 
          sx={{ 
            px: { xs: 2, sm: 2.5, md: 3 }, 
            py: { xs: 1.5, sm: 1.75, md: 2 },
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
          }}
        >
          User Management
        </Typography>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: '0 0 8px 8px',
          border: '1px solid #d1d5db',
          borderTop: 'none',
          bgcolor: 'white',
        }}
      >
        {viewMode === 'management' ? (
          <>
            {/* TABLE VIEW - Same as before */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, flexWrap: 'wrap', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  onClick={handleAddNewUser}
                  sx={{ 
                    bgcolor: '#FF5E00', 
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  ADD NEW USER
                </Button>

                {/* Filter controls - same as before */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 18, 25, 0.6)', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'block' } }}>
                    Filter by
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    sx={{
                      minWidth: { xs: '100%', sm: 200 },
                      flex: { xs: 1, sm: 'none' },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#008756',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#9ca3af', fontSize: { xs: 18, sm: 20 } }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 0, width: { xs: '100%', sm: 'auto' } }}>
                    {(['name', 'email', 'role'] as const).map((filter, index) => (
                      <Button
                        key={filter}
                        variant={filterBy === filter ? 'contained' : 'text'}
                        onClick={() => setFilterBy(filter)}
                        sx={{
                          textTransform: 'capitalize',
                          minWidth: { xs: '33.33%', sm: 80 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          bgcolor: filterBy === filter ? '#ea580c' : 'transparent',
                          color: filterBy === filter ? 'white' : '#374151',
                          borderRight: index < 2 ? '1px solid #d1d5db' : 'none',
                          borderRadius: 0,
                          '&:first-of-type': { borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' },
                          '&:last-of-type': { borderTopRightRadius: '4px', borderBottomRightRadius: '4px' },
                          '&:hover': { bgcolor: filterBy === filter ? '#c2410c' : '#f9fafb' },
                        }}
                      >
                        {filter === 'name' ? 'Name' : filter === 'email' ? 'Email' : 'Role'}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>

              <TableContainer sx={{ paddingLeft: { xs: 0, sm: 2, md: 5 }, paddingRight: { xs: 0, sm: 2, md: 5 }, overflowX: 'auto' }}>
                <Table sx={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: 'none', py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 }, minWidth: { xs: 150, sm: 200 } }}>
                        <Box sx={{ display: 'inline-block', bgcolor: '#FF5E00', color: 'white', fontWeight: 500, textTransform: 'uppercase', fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 2, sm: 4 }, py: { xs: 1, sm: 1.5 } }}>
                          FULL NAME
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: 'none', py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 }, minWidth: { xs: 150, sm: 200 } }}>
                        <Box sx={{ display: 'inline-block', bgcolor: 'rgba(0, 0, 0, 0.23)', color: '#39414C', fontWeight: 500, textTransform: 'uppercase', fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 2, sm: 6 }, py: { xs: 1, sm: 1.5 } }}>
                          EMAIL
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: 'none', py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 }, minWidth: { xs: 120, sm: 150 } }}>
                        <Box sx={{ display: 'inline-block', bgcolor: 'rgba(0, 0, 0, 0.23)', color: '#39414C', fontWeight: 500, textTransform: 'uppercase', fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 2, sm: 6 }, py: { xs: 1, sm: 1.5 } }}>
                          ROLE
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: 'none', py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 }, textAlign: 'center', minWidth: { xs: 100, sm: 120 } }}>
                        <Box sx={{ display: 'inline-block', bgcolor: 'rgba(0, 0, 0, 0.23)', color: '#39414C', fontWeight: 500, textTransform: 'uppercase', fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 2, sm: 6 }, py: { xs: 1, sm: 1.5 } }}>
                          ACTION
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>Loading users...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>No users found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.user_account_id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                          <TableCell sx={{ py: { xs: 1, sm: 1.5, md: 2 }, px: { xs: 1, sm: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, md: 2 } }}>
                              <Avatar
                                src={user.image_url}
                                sx={{ width: { xs: 28, sm: 32, md: 40 }, height: { xs: 28, sm: 32, md: 40 }, bgcolor: '#9ca3af' }}
                              >
                                {user.username.charAt(0)}
                              </Avatar>
                              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, color: 'rgba(0, 18, 25, 0.6)' }}>
                                {user.username}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: { xs: 1, sm: 1.5, md: 2 }, px: { xs: 1, sm: 2 } }}>
                            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, color: 'rgba(0, 18, 25, 0.6)', wordBreak: 'break-word' }}>
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: { xs: 1, sm: 1.5, md: 2 }, px: { xs: 1, sm: 2 } }}>
                            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, color: 'rgba(0, 18, 25, 0.6)' }}>
                              {user.role}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: { xs: 1, sm: 1.5, md: 2 }, px: { xs: 0.5, sm: 1, md: 2 }, textAlign: 'center' }}>
                            <Button
                              variant="text"
                              size="small"
                              endIcon={<ArrowDropDownIcon />}
                              onClick={(e) => handleEditClick(e, user.user_account_id)}
                              sx={{ textTransform: 'none', color: '#374151', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              Edit
                            </Button>
                            <Menu
                              anchorEl={editMenuAnchor}
                              open={Boolean(editMenuAnchor) && selectedUserId === user.user_account_id}
                              onClose={handleEditMenuClose}
                            >
                              <MenuItem onClick={() => handleEditUser(user)}>Edit User Details</MenuItem>
                              <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>Delete User</MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        ) : (
          <>
            {/* CREATE / EDIT FORM */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {viewMode === 'edit' ? `Edit User: ${editingUser?.email}` : 'Create New User'}
              </Typography>

              <Grid container spacing={3}>
                {/* Image Upload - Same as before */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, mb: 3, flexWrap: 'wrap' }}>
                    <Avatar src={previewImage || undefined} sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, bgcolor: '#9ca3af' }}>
                      {!previewImage && <PersonIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />}
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                      <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
                      {!previewImage ? (
                        <Button variant="contained" onClick={() => fileInputRef.current?.click()} sx={{ bgcolor: '#FF5E00', textTransform: 'uppercase', '&:hover': { bgcolor: '#c2410c' } }}>
                          ADD PICTURE
                        </Button>
                      ) : (
                        <>
                          <Button variant="contained" onClick={handleChangePicture} sx={{ bgcolor: '#FF5E00', textTransform: 'uppercase', '&:hover': { bgcolor: '#c2410c' } }}>
                            CHANGE PICTURE
                          </Button>
                          <Button variant="outlined" onClick={handleRemovePicture} sx={{ textTransform: 'uppercase', borderColor: '#d1d5db', color: 'rgba(0, 18, 25, 0.6)' }}>
                            REMOVE PICTURE
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Full Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jimmy Jam"
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#008756' } }}
                  />
                </Grid>

                {/* Email - Disabled in Edit Mode */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jimmyjam@gmail.com"
                    disabled={viewMode === 'edit'} // ✅ Disabled when editing
                    helperText={viewMode === 'edit' ? 'Email cannot be changed' : ''}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#008756' },
                      '& .Mui-disabled': { bgcolor: '#f3f4f6' }
                    }}
                  />
                </Grid>

                {/* Contact Number */}
                <Grid item xs={12} md={6}>
                  <PhoneInput
                    country={'in'}
                    value={contactNumber}
                    onChange={(value) => setContactNumber(value)}
                    inputStyle={{ width: '100%', height: '56px' }}
                    placeholder="Enter Contact Number"
                    enableSearch
                  />
                </Grid>

                {/* Language */}
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#008756' } }}>
                    {languages.map((lang) => (
                      <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Role */}
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField select fullWidth label="Role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#008756' } }}>
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
                    <Button variant="outlined" onClick={handleBackToManagement} sx={{ textTransform: 'uppercase', borderColor: '#d1d5db', color: 'rgba(0, 18, 25, 0.6)', width: { xs: '100%', sm: 'auto' } }}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={viewMode === 'edit' ? handleUpdateUser : handleCreateUser}
                      disabled={creatingUser || !fullName || (viewMode === 'create' && !email) || !contactNumber}
                      sx={{
                        bgcolor: '#FF5E00',
                        textTransform: 'uppercase',
                        width: { xs: '100%', sm: 'auto' },
                        '&:hover': { bgcolor: '#c2410c' },
                        '&:disabled': { bgcolor: '#e5e7eb', color: '#9ca3af' },
                      }}
                    >
                      {creatingUser ? (viewMode === 'edit' ? 'Updating...' : 'Creating...') : (viewMode === 'edit' ? 'UPDATE USER' : 'CREATE USER')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ bgcolor: snackbarSeverity === 'success' ? '#EDF7ED' : '#FEE2E2', color: snackbarSeverity === 'success' ? '#1E4620' : '#991B1B' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}