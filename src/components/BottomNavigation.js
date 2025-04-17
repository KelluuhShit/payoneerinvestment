import { NavLink } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  TrendingUp as InvestIcon,
  AccountBalance as AssetsIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';

const BottomNavigationBar = () => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
      borderTop: '1px solid #e0e0e0',
      boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
    }}
  >
    <BottomNavigation showLabels>
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        component={NavLink}
        to="/"
        sx={{
          '&.active': {
            color: '#2087EC',
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 600,
            },
          },
          color: '#666',
          fontFamily: 'Inter, sans-serif',
          '&:hover': {
            color: '#2087EC',
            transform: 'scale(1.1)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      />
      <BottomNavigationAction
        label="Invest"
        icon={<InvestIcon />}
        component={NavLink}
        to="/invest"
        sx={{
          '&.active': {
            color: '#2087EC',
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 600,
            },
          },
          color: '#666',
          fontFamily: 'Inter, sans-serif',
          '&:hover': {
            color: '#2087EC',
            transform: 'scale(1.1)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      />
      <BottomNavigationAction
        label="Assets"
        icon={<AssetsIcon />}
        component={NavLink}
        to="/assets"
        sx={{
          '&.active': {
            color: '#2087EC',
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 600,
            },
          },
          color: '#666',
          fontFamily: 'Inter, sans-serif',
          '&:hover': {
            color: '#2087EC',
            transform: 'scale(1.1)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      />
      <BottomNavigationAction
        label="Profile"
        icon={<ProfileIcon />}
        component={NavLink}
        to="/profile"
        sx={{
          '&.active': {
            color: '#2087EC',
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 600,
            },
          },
          color: '#666',
          fontFamily: 'Inter, sans-serif',
          '&:hover': {
            color: '#2087EC',
            transform: 'scale(1.1)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      />
    </BottomNavigation>
  </Box>
);

export default BottomNavigationBar;