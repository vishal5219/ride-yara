import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

function Home() {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
      <Helmet>
        <title>Uber Clone Home</title>
        <meta name="description" content="Uber-like app home page" />
      </Helmet>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" gutterBottom>Welcome to Uber Clone</Typography>
        <Typography variant="body1">A modern ride-hailing platform built with microservices, real-time updates, and a beautiful UI.</Typography>
      </Box>
    </motion.div>
  );
}

export default Home; 