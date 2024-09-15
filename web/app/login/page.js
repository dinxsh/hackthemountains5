"use client"
import { useState } from 'react';
import { Box, Container, Typography, Button, Paper, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const moveBlob = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -50px) scale(1.1); }
  50% { transform: translate(-30px, 60px) scale(0.9); }
  75% { transform: translate(40px, 40px) scale(1.05); }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(45deg, #000000 30%, #1a1a1a 90%)',
  padding: theme.spacing(12, 0, 8),
  animation: `${fadeIn} 1.5s ease-out`,
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Blob = styled('div')(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(60px)',
  opacity: 0.3,
  zIndex: 1,
  animation: `${moveBlob} 20s infinite alternate`,
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  color: '#70E000',
  fontWeight: 900,
  marginBottom: theme.spacing(4),
  animation: `${slideUp} 1.2s ease-out`,
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  marginBottom: theme.spacing(6),
  animation: `${slideUp} 1.2s ease-out 0.3s`,
  animationFillMode: 'both',
  position: 'relative',
  zIndex: 2,
  maxWidth: '600px',
  margin: '0 auto',
  textAlign: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #70E000 30%, #5CBA00 90%)',
  color: '#000000',
  padding: '12px 24px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(45deg, #5CBA00 30%, #70E000 90%)',
    transform: 'scale(1.05)',
  },
  animation: `${slideUp} 1.2s ease-out 0.6s`,
  animationFillMode: 'both',
  position: 'relative',
  zIndex: 2,
}));

export default function Login() {
  const router = useRouter();
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#70E000', fontWeight: 'bold' }}>
            ezlearn
          </Typography>
        </Toolbar>
      </AppBar>
      <HeroContainer>
        <Blob sx={{ width: '300px', height: '300px', top: '10%', left: '10%', background: 'rgba(112, 224, 0, 0.2)' }} />
        <Blob sx={{ width: '250px', height: '250px', bottom: '20%', right: '15%', background: 'rgba(92, 186, 0, 0.2)' }} />
        <Blob sx={{ width: '200px', height: '200px', top: '40%', right: '30%', background: 'rgba(255, 255, 255, 0.1)' }} />
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative', zIndex: 2 }}>
          <HeroTitle variant="h2" component="h1">
            Welcome Back to ezlearn
          </HeroTitle>
          <HeroSubtitle variant="h5">
            Sign in to continue your sustainable learning journey.
          </HeroSubtitle>
          <Paper elevation={3} sx={{ p: 4, mb: 4, background: 'rgba(52, 58, 64, 0.1)', borderRadius: '15px', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 2, margin: '20px auto' }}>
            <StyledButton variant="contained" onClick={handleLogin}>
              Sign In
            </StyledButton>
          </Paper>
        </Container>
      </HeroContainer>
    </Box>
  );
}
