import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ShieldIcon from '@mui/icons-material/GppBad';

interface PermissionAlertProps {
  message: string;
  role?: string;
}

const PermissionAlert: React.FC<PermissionAlertProps> = ({ message, role }) => {
  return (
    <Alert
      severity="error"
      icon={<ShieldIcon />}
      sx={{ border: '1px solid', borderColor: 'error.main' }}
    >
      <AlertTitle>Permission Denied</AlertTitle>

      <Typography variant="body2">
        {message}
      </Typography>

      {role && (
        <Box mt={1}>
          <Typography variant="caption" color="text.secondary">
            Current Role:{' '}
            <Box component="span" fontWeight="fontWeightMedium">
              {role}
            </Box>
          </Typography>
        </Box>
      )}
    </Alert>
  );
};

export default PermissionAlert;
