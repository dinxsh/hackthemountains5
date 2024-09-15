"use client"
import { useState } from 'react';
import { Box, Container, Typography, Button, Paper, AppBar, Toolbar, CircularProgress, Tooltip, TextField, Zoom } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@mui/system';
import * as pdfjsLib from 'pdfjs-dist';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { motion } from 'framer-motion';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

const pulseGlow = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(34, 139, 34, 0.5); }
  50% { text-shadow: 0 0 20px rgba(34, 139, 34, 0.8); }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(45deg, #1b4332 30%, #2d6a4f 90%)',
  padding: theme.spacing(12, 0, 8),
  animation: `${fadeIn} 1.5s ease-out`,
  overflow: 'hidden',
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundImage: 'url("/forest-background.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const Blob = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(60px)',
  opacity: 0.3,
  zIndex: 1,
}));

const HeroTitle = styled(motion.h1)(({ theme }) => ({
  color: '#2ecc71',
  fontWeight: 900,
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  fontSize: '3.5rem',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  animation: `${pulseGlow} 3s infinite`,
}));

const HeroSubtitle = styled(motion.h5)(({ theme }) => ({
  color: '#ecf0f1',
  marginBottom: theme.spacing(6),
  position: 'relative',
  zIndex: 2,
  maxWidth: '600px',
  margin: '0 auto',
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 300,
  lineHeight: 1.6,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
  color: '#ffffff',
  padding: '14px 28px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(45deg, #2ecc71 30%, #27ae60 90%)',
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(46, 204, 113, 0.4)',
  },
  position: 'relative',
  zIndex: 2,
  transition: 'all 0.3s ease-in-out',
  borderRadius: '30px',
  textTransform: 'none',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  background: 'rgba(52, 73, 94, 0.7)',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  zIndex: 2,
  margin: '20px auto',
  width: '100%',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
}));

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notes, setNote] = useState([]);
  const [newNote, setNewNote] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setLoading(true);
      const fileURL = URL.createObjectURL(file);
      setPdfFile(fileURL);
      try {
        await extractPdfContent(fileURL);
      } catch (error) {
        console.error('Error processing PDF:', error);
        alert('An error occurred while processing the PDF. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const extractPdfContent = async (fileURL) => {
    const loadingTask = pdfjsLib.getDocument(fileURL);
    const pdf = await loadingTask.promise;

    let importantContent = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const relevantItems = textContent.items.filter(item => {
        const text = item.str.trim();
        const isEnglish = /^[a-zA-Z0-9\s.,;:!?()'-]+$/.test(text);
        const isMeaningful = text.length > 3;
        const isTitle = item.fontName.includes("Bold") || item.height > 12;
        const isSubtitle = item.fontName.includes("Italic");
        const isKeyPoint = item.height <= 12 && !item.fontName.includes("Bold") && text.length > 10;

        return isEnglish && isMeaningful && (isTitle || isSubtitle || isKeyPoint);
      });

      let currentSentence = '';
      const processedItems = [];

      relevantItems.forEach(item => {
        currentSentence += item.str.trim() + ' ';
        if (currentSentence.match(/[.!?]$/)) {
          let prefix = '';
          if (item.fontName.includes("Bold") && item.height > 14) prefix = "Title: ";
          else if (item.fontName.includes("Bold") || item.height > 12) prefix = "Subtitle: ";
          else if (item.fontName.includes("Italic")) prefix = "Highlight: ";

          processedItems.push(prefix + currentSentence.trim());
          currentSentence = '';
        }
      });

      if (currentSentence.trim() !== '') {
        processedItems.push("" + currentSentence.trim() + '.');
      }

      importantContent = [...importantContent, ...processedItems];
    }

    setPdfText(importantContent);
    setTotalTasks(importantContent.length);
    setCompletedTasks(new Array(importantContent.length).fill(false));
    console.log("Important Content:", importantContent.join('\n'));
  };

  const handleCheckboxChange = (index) => {
    const newCompletedTasks = [...completedTasks];
    newCompletedTasks[index] = !newCompletedTasks[index];
    setCompletedTasks(newCompletedTasks);
    const tasksCompleted = newCompletedTasks.filter(Boolean).length;
    setTotalTasks(pdfText.length);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(27, 67, 50, 0.8)', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#2ecc71', fontWeight: 'bold', fontSize: '1.5rem' }}>
            justlearn
          </Typography>
          <Button color="inherit" sx={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1.1rem' }}>Sign In</Button>
        </Toolbar>
      </AppBar>
      <HeroContainer>
        <Blob
          sx={{ width: '300px', height: '300px', top: '10%', left: '10%', background: 'rgba(46, 204, 113, 0.2)' }}
          animate={{ x: [0, 50, -30, 40, 0], y: [0, -50, 60, 40, 0], scale: [1, 1.1, 0.9, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        <Blob
          sx={{ width: '250px', height: '250px', bottom: '20%', right: '15%', background: 'rgba(39, 174, 96, 0.2)' }}
          animate={{ x: [0, -40, 30, -50, 0], y: [0, 60, -40, 30, 0], scale: [1, 0.9, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        />
        <Blob
          sx={{ width: '200px', height: '200px', top: '40%', right: '30%', background: 'rgba(236, 240, 241, 0.1)' }}
          animate={{ x: [0, 30, -50, 20, 0], y: [0, -30, 50, -40, 0], scale: [1, 1.05, 0.95, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <Blob
          sx={{ width: '180px', height: '180px', top: '15%', right: '5%', background: 'rgba(52, 152, 219, 0.2)' }}
          animate={{ x: [0, 40, -20, 30, 0], y: [0, -40, 30, -20, 0], scale: [1, 1.1, 0.9, 1.05, 1] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
        />
        <Blob
          sx={{ width: '220px', height: '220px', bottom: '10%', left: '25%', background: 'rgba(155, 89, 182, 0.2)' }}
          animate={{ x: [0, -30, 50, -40, 0], y: [0, 50, -30, 40, 0], scale: [1, 0.95, 1.1, 0.9, 1] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
        />
        <Blob
          sx={{ width: '150px', height: '150px', top: '60%', left: '5%', background: 'rgba(241, 196, 15, 0.2)' }}
          animate={{ x: [0, 20, -40, 30, 0], y: [0, -30, 20, -40, 0], scale: [1, 1.05, 0.95, 1.1, 1] }}
          transition={{ duration: 17, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
          }}>
          <HeroTitle
            component={motion.h1}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Welcome to justlearn
          </HeroTitle>
          <HeroSubtitle
            component={motion.h2}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            sx={{
              marginBottom: '48px',
              fontSize: '1.5rem',
              fontWeight: 300,
              letterSpacing: '0.5px',
              color: 'rgba(236, 240, 241, 0.9)',
              textAlign: 'center',
              maxWidth: '600px',
            }}
          >
            Empowering students to study efficiently with AI
          </HeroSubtitle>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
              <input
                accept=".pdf"
                id="contained-button-file"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none', marginTop:'10px' }}
              />
              <label htmlFor="contained-button-file">
                <Tooltip title="Upload your PDF" placement="top" TransitionComponent={Zoom}>
                  <StyledButton
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom:'40px' }}
                  >
                    Upload PDF
                  </StyledButton>
                </Tooltip>
              </label>
          </motion.div>
          </div>
          {loading && (
            <CircularProgress sx={{ color: '#2ecc71', mt: 2 }} />
          )}
          <div style={{}}>
          {pdfFile && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ width: '100%' }}
            >
              <Box sx={{ width:'100%', display:'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, marginTop:'20px'}}>
                  <iframe
                    src={pdfFile}
                    style={{ height: '1000px', width:'1000px', border: 'none', marginTop:'15px' }}
                    title="PDF Viewer"
                  />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, margin: '0 20px' }}>
                  <StyledPaper sx={{
                    width: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '15px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography variant="h5" sx={{
                      color: '#2ecc71',
                      mb: 2,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      textShadow: '0 1px 2px rgba(46, 204, 113, 0.2)'
                    }}>
                      Sections
                    </Typography>
                    <List sx={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      width: '100%',
                      '&::-webkit-scrollbar': {width: '8px'},
                      '&::-webkit-scrollbar-track': {background: 'rgba(30, 30, 30, 0.5)', borderRadius: '8px'},
                      '&::-webkit-scrollbar-thumb': {background: '#2ecc71', borderRadius: '8px'},
                      '&::-webkit-scrollbar-thumb:hover': {background: '#27ae60'},
                    }}>
                      {pdfText.map((text, index) => (
                        <ListItem key={index} disablePadding sx={{position: 'relative', mb: '8px'}}>
                          <ListItemButton
                            dense
                            onClick={() => handleCheckboxChange(index)}
                            sx={{
                              borderRadius: '8px',
                              '&:hover': {backgroundColor: 'rgba(46, 204, 113, 0.2)'},
                              transition: 'all 0.2s ease',
                              border: '1px solid rgba(46, 204, 113, 0.3)'
                            }}
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                tabIndex={-1}
                                disableRipple
                                checked={completedTasks[index]}
                                onChange={(event) => {
                                  const newCompletedTasks = [...completedTasks];
                                  newCompletedTasks[index] = event.target.checked;
                                  setCompletedTasks(newCompletedTasks);
                                  setTotalTasks(pdfText.length);
                                }}
                                sx={{
                                  color: '#2ecc71',
                                  '&.Mui-checked': {color: '#2ecc71'},
                                  '& .MuiSvgIcon-root': {fontSize: 24},
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${text.split(' ').slice(0, 6).join(' ')}...`}
                              sx={{
                                color: 'white',
                                '& .MuiTypography-root': {
                                  fontSize: '1rem',
                                  fontWeight: 'medium',
                                  lineHeight: 1.2,
                                  textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
                                }
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </StyledPaper>
                  <StyledPaper sx={{
                    width: '110%',
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '15px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography variant="h5" sx={{
                      color: '#2ecc71',
                      mb: 2,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      textShadow: '0 1px 2px rgba(46, 204, 113, 0.2)'
                    }}>
                      Progress
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={(completedTasks.filter(Boolean).length / totalTasks) * 100}
                          size={80}
                          thickness={4}
                          sx={{
                            color: '#2ecc71',
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                            },
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                            {`${Math.round((completedTasks.filter(Boolean).length / totalTasks) * 100)}%`}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                        {`${completedTasks.filter(Boolean).length} of ${totalTasks} tasks completed`}
                      </Typography>
                    </Box>
                  </StyledPaper>
                </Box>
              </Box>
            </motion.div>
          )}
          </div>
        </Container>
      </HeroContainer>
    </Box>
  );
}
