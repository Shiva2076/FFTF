'use client';

import { Box, Typography, Button } from '@mui/material';

export default function HomePage() {
  const handleClick = () => {
    alert('Hello from Next.js!');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        fontFamily: 'Poppins',
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="#333">
        Welcome to the Dummy Page
      </Typography>

      <Typography variant="body1" color="text.secondary">
        This is a sample Next.js 13+ page using the App Router.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        sx={{
          backgroundColor: '#ff5e00',
          '&:hover': {
            backgroundColor: '#e65500',
          },
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Click Me
      </Button>
    </Box>
  );
}
