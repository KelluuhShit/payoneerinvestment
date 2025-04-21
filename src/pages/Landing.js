import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userId'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250, p: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {isAuthenticated ? (
          <ListItem button onClick={() => navigate('/')}>
            <ListItemText primary="Go to Dashboard" />
          </ListItem>
        ) : (
          [
            { text: 'Sign In', path: '/signin' },
            { text: 'Sign Up', path: '/signup' },
          ].map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #e8f0fe, #ffffff)' }}>
      <AppBar
        position="static"
        sx={{
          background: '#fff',
          boxShadow: 1,
          borderBottom: '1px solid #e0e0e0',
          px: { xs: 2, sm: 4 },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              color: '#2087EC',
              flexGrow: { xs: 1, sm: 0 },
            }}
          >
            Payoneer Investment
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  borderRadius: 8,
                  background: '#2087EC',
                  color: '#fff',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': { background: '#1a6dc3', transform: 'scale(1.05)' },
                }}
                aria-label="Go to Dashboard"
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
                  aria-label="Sign In"
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
                  aria-label="Sign Up"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: '#2087EC' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
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
                fontSize: { xs: '2rem', md: '3rem' },
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
                mx: { xs: 'auto', md: 0 },
              }}
            >
              Join thousands of investors earning daily income through cutting-edge crypto mining machines like Bitmain Antminer.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(isAuthenticated ? '/' : '/signup')}
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
              aria-label={isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
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
            component="img"
            src="https://static.vecteezy.com/system/resources/previews/010/877/536/non_2x/3d-illustration-ethereum-and-ring-free-png.png"
            alt="Crypto mining illustration"
            sx={{
              width: { xs: '100%', sm: '300px', md: '400px' },
              height: { xs: '250px', sm: '300px', md: '300px' },
              objectFit: 'contain',
            }}
          />
        </motion.div>
      </Box>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 6, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            color: '#000',
            mb: 4,
            fontSize: { xs: '1.8rem', md: '2.5rem' },
          }}
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
            height: '100%',
          }}
        >
          {[
            { title: 'Crypto Mining', image: 'https://static.vecteezy.com/system/resources/previews/010/877/409/non_2x/3d-illustration-exchange-ethereum-with-dollars-free-png.png', desc: 'Earn daily with advanced mining hardware.' },
            { title: 'Stocks', image: 'https://static.vecteezy.com/system/resources/previews/028/860/786/non_2x/growth-chart-3d-icon-for-business-free-png.png', desc: 'Invest in top-performing companies.' },
            { title: 'Real Estate', image: 'https://static.vecteezy.com/system/resources/previews/010/877/535/non_2x/3d-illustration-box-nft-and-ethereum-free-png.png', desc: 'Build wealth through property investments.' },
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
                  component="img"
                  src={category.image}
                  alt={`${category.title} illustration`}
                  sx={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'contain',
                  }}
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