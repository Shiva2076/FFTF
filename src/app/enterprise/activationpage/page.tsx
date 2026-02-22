
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import EnterpriseWizard from "@/components/Enterprise/EnterpriseWizard";
import { Box, Typography, Dialog, Container, Paper } from "@mui/material";
import Login from "@/components/Auth/Signin";
import Register from "@/components/Auth/Register";
import LoadingSpinner from "@/components/LoadingSpinner";

type AuthModal = 'closed' | 'login' | 'register';

export default function ActivationPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [authModal, setAuthModal] = useState<AuthModal>('login');
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(userInfo?.user_id);

  // Check authentication on mount
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Show loading spinner during initial check
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, show login dialog
  if (!isAuthenticated) {
    return (
      <>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              textAlign: "center",
              backgroundColor: '#fff',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: '#008756',
                mb: 2
              }}
            >
              Enterprise Supply Intelligence
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 3 }}
            >
              Connect market demand with real supply readiness across your supplier farms
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                fontSize: '1rem',
                lineHeight: 1.6
              }}
            >
              Please login to activate Enterprise Supply Intelligence and start connecting 
              your supplier network.
            </Typography>
            
            {/* Feature highlights */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mt: 4,
              textAlign: 'left'
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#008756' }}>
                  📊 Market Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI-recommended crops by demand, price, and profitability
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#008756' }}>
                  🌾 Supply Intelligence
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time supply readiness and risk indicators
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#008756' }}>
                  🔗 Network Integration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No hardware, no sensors - software-only activation
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>

        {/* Auth Dialog */}
        <Dialog 
          open={!isAuthenticated} 
          onClose={() => router.push('/apps/enterprise/innomarkettrend')}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          {authModal === 'register' ? (
            <Register 
              open={true}
              onClose={() => router.push('/apps/enterprise/innomarkettrend')} 
              onSwitch={() => setAuthModal('login')} 
            />
          ) : (
            <Login 
              onClose={() => router.push('/apps/enterprise/innomarkettrend')} 
              onSwitch={() => setAuthModal('register')} 
            />
          )}
        </Dialog>
      </>
    );
  }

  // Authenticated user - show wizard
  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', // Account for header
      backgroundColor: '#f5f5f5',
      py: 4 
    }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: '#008756',
              mb: 1
            }}
          >
            🔐 Enterprise Intelligence Activation
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: '1rem',
              lineHeight: 1.6,
              maxWidth: 800
            }}
          >
            Complete the activation process to connect your enterprise with supplier farms. 
            This enables market-to-supply visibility, predictive intelligence, and traceability 
            across your network.
          </Typography>
        </Box>

        {/* Wizard Component */}
        <Paper 
          elevation={2}
          sx={{ 
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            backgroundColor: '#fff'
          }}
        >
          <EnterpriseWizard />
        </Paper>

        {/* Help Section */}
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: 'rgba(0, 135, 86, 0.05)',
          borderRadius: 2,
          border: '1px solid rgba(0, 135, 86, 0.2)'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            💡 <strong>Need help?</strong> Contact our team at{' '}
            <a 
              href="https://wa.me/+919220346184" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#008756', textDecoration: 'none', fontWeight: 600 }}
            >
              WhatsApp Support
            </a>
            {' '}or book a{' '}
            <a 
              href="#" 
              style={{ color: '#008756', textDecoration: 'none', fontWeight: 600 }}
              onClick={(e) => {
                e.preventDefault();
                // Add your Calendly link here
                if (typeof window !== 'undefined' && (window as any).Calendly) {
                  (window as any).Calendly.initPopupWidget({
                    url: 'YOUR_CALENDLY_LINK_HERE'
                  });
                }
              }}
            >
              15-minute activation call
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}