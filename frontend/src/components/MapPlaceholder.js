import React from 'react';
import { Box, Typography } from '@mui/material';

function MapPlaceholder() {
  return (
    <Box sx={{ height: 300, background: '#eee', borderRadius: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="body2">Map will be rendered here</Typography>
    </Box>
  );
}

export default MapPlaceholder; 