import { NextPage } from 'next';
import { Box, Button, Typography } from '@mui/material';

const EmailUpdateSuccess: NextPage = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0rem 0rem 2rem',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: '2.125rem',
        color: 'rgba(0, 18, 25, 0.87)',
        fontFamily: 'Poppins',
      }}
    >
      <Box
        sx={{
          width: '35rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1.5rem',
        }}
      >
        <Typography
          sx={{
            alignSelf: 'stretch',
            letterSpacing: '0.25px',
            lineHeight: '123.5%',
            display: '-webkit-inline-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontWeight: 'bold',
          }}
        >
          Email Updated Successfully
        </Typography>
        <Typography
          sx={{
            alignSelf: 'stretch',
            fontSize: '1rem',
            letterSpacing: '0.15px',
            lineHeight: '200%',
            color: 'rgba(0, 18, 25, 0.6)',
          }}
        >
          Your email has been updated to <b style={{ color: '#008756' }}>user@email.com</b>. We’ve sent a new verification link. Please check your inbox.
        </Typography>
        <Box
          sx={{
            width: '35rem',
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'left',
            fontSize: '0.938rem',
          }}
        >
          <Button
            variant="outlined"
            sx={{ flex: 1, borderRadius: '4px', textTransform: 'uppercase', fontWeight: 500 }}
          >
            Change Email Address
          </Button>
          <Button
            variant="outlined"
            sx={{ flex: 1, borderRadius: '4px', textTransform: 'uppercase', fontWeight: 500 }}
          >
            Resend Verification Email
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailUpdateSuccess;
