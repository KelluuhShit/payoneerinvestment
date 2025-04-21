import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Link,
  LinearProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userId'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const animatedValueControls = useAnimation();
  const progressControls = useAnimation();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      console.log('Newsletter subscription:', newsletterEmail);
      setNewsletterEmail('');
      alert('Thank you for subscribing!');
    }
  };

  // Animation for the investment value and progress bar
  useEffect(() => {
    animatedValueControls.start({
      value: 850,
      transition: { duration: 5, ease: 'easeOut' },
    });
    progressControls.start({
      value: 100,
      transition: { duration: 5, ease: 'linear' },
    });
  }, [animatedValueControls, progressControls]);

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
      {/* Header */}
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
              Join thousands of investors earning daily income through cutting-edge crypto mining machines like Bitmain Antminer and MicroBT Whatsminer.
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
            src="https://asic-miner-profitability.com/profit/images/miners/webp/bitmain_antminer_s19_hydrodesign_image3.webp"
            alt="Bitmain Antminer illustration"
            sx={{
              width: { xs: '100%', sm: '300px', md: '400px' },
              height: { xs: '250px', sm: '300px', md: '300px' },
              objectFit: 'contain',
            }}
          />
        </motion.div>
      </Box>

      {/* Animated Investment Value Section */}
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: 6,
          textAlign: 'center',
          background: '#fff',
          boxShadow: 2,
          borderRadius: 3,
          maxWidth: '800px',
          mx: 'auto',
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            color: '#000',
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Watch Your Investment Grow
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Inter, sans-serif',
            color: '#666',
            mb: 3,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          See how a KES 500 investment in Bitmain Antminer S21 Hyd grows with 10% daily returns over 7 days.
        </Typography>
        <motion.div
          animate={animatedValueControls}
          initial={{ value: 500 }}
        >
          {({ value }) => (
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                color: '#2087EC',
                mb: 2,
              }}
            >
              KES {Math.round(value).toFixed(2)}
            </Typography>
          )}
        </motion.div>
        <Box sx={{ maxWidth: '400px', mx: 'auto', mb: 2 }}>
          <motion.div
            animate={progressControls}
            initial={{ value: 0 }}
          >
            {({ value }) => (
              <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#2087EC' },
                }}
              />
            )}
          </motion.div>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Inter, sans-serif',
            color: '#666',
          }}
        >
          Projected total: KES 850 by day 7
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(isAuthenticated ? '/' : '/signup')}
          sx={{
            mt: 3,
            borderRadius: 8,
            background: '#2087EC',
            color: '#fff',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            px: 4,
            py: 1.5,
            '&:hover': { background: '#1a6dc3', transform: 'scale(1.05)' },
          }}
          aria-label="Start Investing"
        >
          Start Investing
        </Button>
      </Box>

      {/* Investment Opportunities Section */}
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
          Explore Crypto Mining Opportunities
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
            {
              title: 'Bitmain Antminer S21 Hyd',
              image: 'https://asic-miner-profitability.com/profit/images/miners/webp/bitmain_antminer_s19_hydrodesign_image3.webp',
              desc: 'Invest KES 500 for 7 days with 10% daily returns. Join 5,000 active investors earning KES 50 daily.',
              investors: '5,000',
              dailyIncome: 'KES 50.00',
            },
            {
              title: 'MicroBT Whatsminer M50S',
              image: 'https://www.theminingshop.co.uk/wp-content/uploads/2023/11/MicroBT-Whatsminer-M50-128th-MicroBT-miner-Buy-Asic-miner-Front.png',
              desc: 'Start with KES 1,500 over 7 days for daily crypto income. 4,000 investors trust this machine.',
              investors: '4,000',
              dailyIncome: 'KES 150.00',
            },
            {
              title: 'Bitmain Antminer S21 Pro',
              image: 'https://www.bitmart.co.za/wp-content/uploads/2024/07/Antminer-KS5Pro-21th-NEW.png',
              desc: 'High returns with KES 4,000 investment over 7 days. 4,800 investors, KES 400 daily income.',
              investors: '4,800',
              dailyIncome: 'KES 400.00',
            },
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
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
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
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: '#000',
                    mb: 1,
                  }}
                >
                  {category.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#666',
                    flexGrow: 1,
                    mb: 2,
                  }}
                >
                  {category.desc}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(isAuthenticated ? '/' : '/signup')}
                  sx={{
                    borderRadius: 8,
                    borderColor: '#2087EC',
                    color: '#2087EC',
                    textTransform: 'none',
                    fontFamily: 'Inter, sans-serif',
                    '&:hover': { background: '#2087EC', color: '#fff' },
                  }}
                  aria-label={`Learn more about ${category.title}`}
                >
                  Learn More
                </Button>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: '#1a1a1a',
          color: '#fff',
          px: { xs: 2, sm: 4 },
          py: 6,
          mt: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            justifyContent: 'space-between',
          }}
        >
          {/* Company Info */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Payoneer Investment
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Inter, sans-serif',
                color: '#ccc',
                maxWidth: '300px',
                mx: { xs: 'auto', md: 0 },
              }}
            >
              Empowering wealth creation through advanced crypto mining solutions. Invest in Bitmain Antminer and MicroBT Whatsminer today.
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { text: 'About Us', path: '/about' },
                { text: 'Contact', path: '/contact' },
                { text: 'Privacy Policy', path: '/privacy' },
                { text: 'Terms of Service', path: '/terms' },
              ].map((link) => (
                <Link
                  key={link.text}
                  href={link.path}
                  sx={{
                    color: '#ccc',
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'none',
                    '&:hover': { color: '#2087EC' },
                  }}
                  aria-label={link.text}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Newsletter Signup */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Stay Updated
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Inter, sans-serif',
                color: '#ccc',
                mb: 2,
              }}
            >
              Subscribe to our newsletter for the latest crypto mining opportunities.
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}
            >
              <TextField
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    background: '#fff',
                    borderRadius: '8px 0 0 8px',
                    fontFamily: 'Inter, sans-serif',
                  },
                  '& .MuiInputBase-input': { p: 1 },
                  width: { xs: '100%', sm: '200px' },
                }}
                aria-label="Newsletter email"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: '0 8px 8px 0',
                  background: '#2087EC',
                  color: '#fff',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  px: 2,
                  '&:hover': { background: '#1a6dc3' },
                }}
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Social Media and Copyright */}
        <Divider sx={{ my: 4, borderColor: '#444' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            mx: 'auto',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              sx={{ color: '#ccc', '&:hover': { color: '#2087EC' } }}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              sx={{ color: '#ccc', '&:hover': { color: '#2087EC' } }}
              aria-label="Twitter"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              sx={{ color: '#ccc', '&:hover': { color: '#2087EC' } }}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: '#ccc',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            © {new Date().getFullYear()} Payoneer Investment. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;