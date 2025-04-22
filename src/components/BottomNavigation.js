import { useEffect, useState, memo } from 'react';
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
import { motion } from 'framer-motion';
import { db, doc, getDoc } from '../service/firebase';

const BottomNavigationBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        setIsAuthenticated(userDoc.exists());
      } catch (err) {
        console.error('Error validating user:', err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, to: '/home' },
    { label: 'Invest', icon: <InvestIcon />, to: '/invest' },
    { label: 'Assets', icon: <AssetsIcon />, to: '/assets' },
    { label: 'Profile', icon: <ProfileIcon />, to: '/profile' },
  ];

  if (isAuthenticated === null) {
    return null; // Optionally render a loading spinner
  }

  return (
    <Box
      component={motion.div}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
        px: { xs: 1, sm: 2 },
      }}
    >
      <BottomNavigation showLabels sx={{ background: 'transparent' }}>
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            component={isAuthenticated ? NavLink : 'div'}
            to={isAuthenticated ? item.to : undefined}
            disabled={!isAuthenticated}
            sx={{
              '&.active': {
                color: '#2087EC',
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              },
              color: isAuthenticated ? '#666' : '#ccc',
              fontFamily: 'Inter, sans-serif',
              minWidth: { xs: '60px', sm: '80px' },
              '&:hover': isAuthenticated
                ? {
                    color: '#2087EC',
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease-in-out',
                  }
                : {},
              '& .MuiBottomNavigationAction-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default memo(BottomNavigationBar);