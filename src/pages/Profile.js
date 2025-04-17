import { Box, Typography } from '@mui/material';

const Profile = () => (
  <Box sx={{ p: 3, pb: 8 }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      Profile
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: '#000',
        fontFamily: 'Inter, sans-serif',
        mt: 2,
      }}
    >
      Manage your account settings and view your profile details.
    </Typography>
  </Box>
);

export default Profile;