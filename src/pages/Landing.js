import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../service/firebase'; // Use initialized Firebase auth
import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #e8f0fe, #ffffff)' }}>
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{ background: '#fff', boxShadow: 1, borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#2087EC' }}
          >
            Payoneer Investment
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                onClick={() => navigate('/home')}
                sx={{
                  borderRadius: 8,
                  background: '#2087EC',
                  color: '#fff',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': { background: '#1a6dc3', transform: 'scale(1.05)' },
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/signin')}
                  sx={{
                    textTransform: 'none',
                    color: '#2087EC',
                    fontFamily: 'Inter, sans-serif',
                    '&:hover': { color: '#1a6dc3' },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    borderRadius: 8,
                    background: '#2087EC',
                    color: '#fff',
                    textTransform: 'none',
                    fontFamily: 'Inter, sans-serif',
                    '&:hover': { background: '#1a6dc3', transform: 'scale(1.05)' },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          px: { xs: 2, sm: 4 },
          mt: 4,
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                color: '#000',
                mb: 2,
              }}
            >
              Invest in Your Future with Crypto Mining
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Inter, sans-serif',
                color: '#666',
                mb: 3,
                maxWidth: '500px',
              }}
            >
              Join thousands of investors earning daily income through cutting-edge crypto mining
              machines like Bitmain Antminer.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(isAuthenticated ? '/home' : '/signup')}
              sx={{
                borderRadius: 8,
                background: '#2087EC',
                color: '#fff',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                px: 4,
                py: 1.5,
                '&:hover': { background: '#1a6dc3', transform: 'scale(1.05)' },
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </motion.div>
        </Box>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: '400px' },
              height: { xs: '200px', md: '300px' },
              background: '#e0e0e0', // Placeholder background color
              borderRadius: 3,
              boxShadow: 3,
            }}
            aria-label="Crypto mining illustration"
          />
        </motion.div>
      </Box>

      {/* Categories Section */}
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 6, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#000', mb: 4 }}
        >
          Explore Investment Opportunities
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {[
            { title: 'Crypto Mining', desc: 'Earn daily with advanced mining hardware.' },
            { title: 'Stocks', desc: 'Invest in top-performing companies.' },
            { title: 'Real Estate', desc: 'Build wealth through property investments.' },
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: '#fff',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4, transform: 'scale(1.02)' },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '150px',
                    background: '#e0e0e0', // Placeholder background color
                    borderRadius: 2,
                    mb: 2,
                  }}
                  aria-label={`${category.title} illustration`}
                />
                <Typography
                  variant="h6"
                  sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#000' }}
                >
                  {category.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'Inter, sans-serif', color: '#666' }}
                >
                  {category.desc}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;