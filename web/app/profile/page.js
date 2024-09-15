"use client"
import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Avatar, Grid, Button } from '@mui/material';
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

const ProfileContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(45deg, #000000 30%, #1a1a1a 90%)',
  padding: theme.spacing(12, 0, 8),
  animation: `${fadeIn} 1.5s ease-out`,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  position: 'relative',
  zIndex: 2,
  animation: `${slideUp} 1.2s ease-out`,
  color: 'white',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
  border: '4px solid #70E000',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #70E000 30%, #5CBA00 90%)',
  color: '#000000',
  padding: '10px 20px',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(45deg, #5CBA00 30%, #70E000 90%)',
    transform: 'scale(1.05)',
  },
  marginTop: theme.spacing(2),
}));

export default function Profile() {
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    level: 'Intermediate',
    points: 1250,
    coursesCompleted: 5,
  });

  useEffect(() => {
    // Fetch student data from API here
    // For now, we're using mock data
  }, []);

  return (
    <ProfileContainer>
      <Container maxWidth="md">
        <ProfilePaper elevation={6}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <StyledAvatar alt={studentData.name} src="/path-to-profile-image.jpg" />
              <Typography variant="h4" sx={{ mt: 2, color: '#70E000' }}>
                {studentData.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {studentData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2, color: '#70E000' }}>
                Student Profile
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Level: {studentData.level}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                EcoPoints: {studentData.points}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Courses Completed: {studentData.coursesCompleted}
              </Typography>
              <StyledButton variant="contained">
                Edit Profile
              </StyledButton>
            </Grid>
          </Grid>
        </ProfilePaper>
      </Container>
    </ProfileContainer>
  );
}
