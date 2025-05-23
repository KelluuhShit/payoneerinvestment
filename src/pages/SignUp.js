import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, collection, addDoc, query, where, getDocs } from '../service/firebase';
import bcrypt from 'bcryptjs';
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Invalid email format.');
      return;
    }
    const fullPhone = `+254${form.phone}`;
    if (!/^\+254\d{9}$/.test(fullPhone)) {
      setError('Phone number must be 9 digits after +254.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const q = query(collection(db, 'users'), where('email', '==', form.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('Email already in use.');
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(form.password, salt);
      await addDoc(collection(db, 'users'), {
        name: form.name,
        email: form.email,
        phone: fullPhone,
        password: hashedPassword,
        createdAt: new Date(),
      });
      navigate('/signin');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e8f0fe, #ffffff)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 6 },
        pt: { xs: 6, sm: 7 }, // Increased padding-top to account for fixed scroller
        gap: { xs: 3, sm: 6, md: 0 },
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* Policy Scroller */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '340px', sm: '400px' },
          mx: 'auto',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '24px',
          zIndex: 1000,
          background: 'rgba(66, 245, 164)', // Consistent background
        }}
      >
        <motion.div
          animate={{
            x: ['0%', '-100%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 20,
              ease: 'linear',
            },
          }}
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            position: 'absolute',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: '#666',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              pr: 4, // Space between repeated text
            }}
          >
            Payoneer Investment is a certified platform with over 50,000 investors. Earn a guaranteed 10% daily interest. Funds are withdrawable after 7 days of placing your investment.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: '#666',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              pr: 4, // Space between repeated text
            }}
          >
            Payoneer Investment is a certified platform with over 50,000 investors. Earn a guaranteed 10% daily interest. Funds are withdrawable after 7 days of placing your investment.
          </Typography>
        </motion.div>
      </Box>

      {/* Left: Content and Image */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 1, sm: 3, md: 4 },
          textAlign: { xs: 'center', md: 'left' },
          maxWidth: { xs: '100%', sm: '500px', md: '50%' },
          mx: { xs: 'auto', sm: 'auto', md: 0 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              color: '#000',
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            Join Payoneer Investment
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: '#666',
              mb: { xs: 2, sm: 4 },
              maxWidth: { xs: '100%', sm: '400px' },
              mx: { xs: 'auto', md: 0 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            Start your journey to financial freedom with crypto mining investments using machines like Bitmain Antminer and MicroBT Whatsminer.
          </Typography>
          <Box
            component="img"
            src="https://asic-miner-profitability.com/profit/images/miners/webp/bitmain_antminer_s19_hydrodesign_image3.webp"
            alt="Bitmain Antminer illustration"
            sx={{
              width: { xs: '100%', sm: '300px', md: '400px' },
              height: { xs: '180px', sm: '250px', md: '300px' },
              objectFit: 'contain',
              mt: { xs: 2, sm: 3 },
              mx: { xs: 'auto', md: 0 },
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          />
        </motion.div>
      </Box>

      {/* Right: Form */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 1, sm: 3, md: 4 },
          display: 'flex',
          justifyContent: 'center',
          mx: { xs: 'auto', sm: 'auto', md: 0 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: { xs: '340px', sm: '400px' },
              minWidth: { xs: '340px', sm: '400px' },
              p: { xs: 2, sm: 3, md: 4 },
              boxSizing: 'border-box',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                color: '#000',
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              Sign Up
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontFamily: 'Inter, sans-serif', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  '& .MuiInputBase-input': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                }}
                aria-label="Full name"
                variant="outlined"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  '& .MuiInputBase-input': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                }}
                aria-label="Email address"
                variant="outlined"
              />
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                fullWidth
                placeholder="712345678"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+254</InputAdornment>,
                }}
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  '& .MuiInputBase-input': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                }}
                aria-label="Phone number"
                variant="outlined"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  '& .MuiInputBase-input': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                }}
                aria-label="Password"
                variant="outlined"
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  '& .MuiInputBase-input': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                }}
                aria-label="Confirm password"
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 8,
                  background: '#2087EC',
                  color: '#fff',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  py: { xs: 0.75, sm: 1.5 },
                  fontSize: { xs: '0.85rem', sm: '1rem' },
                  '&:hover': { background: '#1a6dc3', transform: 'scale(1.05)' },
                }}
              >
                Create Account
              </Button>
            </Box>
            <Typography
              variant="body2"
              sx={{
                mt: { xs: 1.5, sm: 2 },
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                color: '#666',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              Already have an account?{' '}
              <Link to="/signin" style={{ color: '#2087EC', textDecoration: 'none' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SignUp;