"use client"
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Container, Typography, TextField, Button, Paper, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@mui/system';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  position: 'relative',
  zIndex: 2,
  animation: `${slideUp} 1.2s ease-out`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #70E000 30%, #5CBA00 90%)',
  color: '#000000',
  padding: '12px 24px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  marginTop: theme.spacing(3),
  '&:hover': {
    background: 'linear-gradient(45deg, #5CBA00 30%, #70E000 90%)',
    transform: 'scale(1.05)',
  },
}));

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithRedirect } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginWithRedirect({
        screen_hint: 'signup',
        email: email,
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
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
        <Container maxWidth="xs">
          <StyledPaper elevation={6}>
            <Typography component="h1" variant="h4" sx={{ color: '#70E000', mb: 3 }}>
              Register for ezlearn
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
              />
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
              >
                Register
              </StyledButton>
            </Box>
          </StyledPaper>
        </Container>
      </HeroContainer>
    </Box>
  );
};

export default Register;
