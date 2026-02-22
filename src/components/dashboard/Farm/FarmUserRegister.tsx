'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import { Dialog } from '@mui/material';
import Login from '@/components/Auth/Signin';
import Register from '@/components/Auth/Register';

const FarmUserRegister: NextPage = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const handleSwitchToRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };

  const handleSwitchToLogin = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  };

  return (
    <>
      {/* Main Content Box */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          borderRadius: '8px',
          backgroundColor: '#fff',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          gap: '1rem',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {/* Heading */}
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#001219',
            lineHeight: '1.4',
          }}
        >
          Transform Your Farming with AI-Driven Insights
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '0.875rem',
            color: '#444',
            lineHeight: 1.6,
          }}
        >
          Unlock your farm’s potential with our AI-powered dashboard. Monitor crop
          health, optimize resources, and automate processes for maximum yield and
          efficiency. Make smarter farming decisions with real-time insights and
          data all in one place.
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            width: '100%',
          }}
        >
          {/* Sign In Button */}
          <div
            onClick={() => setOpenLogin(true)}
            style={{
              flex: 1,
              borderRadius: '4px',
              border: '1px solid rgba(0, 18, 25, 0.87)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: '#001219',
              }}
            >
              Sign In
            </div>
          </div>

          {/* Register Now Button */}
          <div
            onClick={() => setOpenRegister(true)}
            style={{
              flex: 1,
              borderRadius: '4px',
              backgroundColor: '#ff5e00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: '#fff',
              }}
            >
              Register Now
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
        <Login onClose={() => setOpenLogin(false)} onSwitch={handleSwitchToRegister} />
      </Dialog>

      {/* Register Modal */}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
        <Register open={openRegister} onClose={() => setOpenRegister(false)} onSwitch={handleSwitchToLogin} />
      </Dialog>
    </>
  );
};

export default FarmUserRegister;
