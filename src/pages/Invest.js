import { Box, Typography } from '@mui/material';

const Invest = () => (
  <Box sx={{ p: 3, pb: 8 }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      Invest
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: '#000',
        fontFamily: 'Inter, sans-serif',
        mt: 2,
      }}
    >
      Start investing in Bitcoin mining machines and other opportunities.
    </Typography>
  </Box>
);

export default Invest;