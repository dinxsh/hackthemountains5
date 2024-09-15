"use client"

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper } from '@mui/material';

export default function Dashboard() {
  const [pdfFile, setPdfFile] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const file = searchParams.get('file');
    if (file) {
      setPdfFile(decodeURIComponent(file));
    } else {
      // If no file is provided in the URL, redirect to the home page
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {pdfFile ? (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="body1">PDF file received:</Typography>
          <Box component="iframe" src={pdfFile} width="100%" height="600px" />
        </Paper>
      ) : (
        <Typography variant="body1">Loading PDF file...</Typography>
      )}
    </Box>
  );
}
