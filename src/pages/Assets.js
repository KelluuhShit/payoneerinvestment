import { Box, Typography } from '@mui/material';

const Assets = () => (
  <Box sx={{ p: 3, pb: 8 }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      Assets
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: '#000',
        fontFamily: 'Inter, sans-serif',
        mt: 2,
      }}
    >
      View your investment assets and their performance.
    </Typography>
  </Box>
);

export default Assets;