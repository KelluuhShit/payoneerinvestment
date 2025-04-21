import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, collection, query, where, getDocs } from '../service/firebase';
import bcrypt from 'bcryptjs';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Invalid email format.');
      return;
    }
    try {
      const q = query(collection(db, 'users'), where('email', '==', form.email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('No account found with this email.');
        return;
      }
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const isPasswordValid = await bcrypt.compare(form.password, userData.password);
      if (!isPasswordValid) {
        setError('Incorrect password.');
        return;
      }
      localStorage.setItem('userId', userDoc.id);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e8f0fe, #ffffff)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
      }}
    >
      {/* Left: Content and Image */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          textAlign: { xs: 'center', md: 'left' },
          maxWidth: { md: '50%' },
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
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: '#666',
              mb: 3,
              maxWidth: '400px',
              mx: { xs: 'auto', md: 0 },
            }}
          >
            Log in to manage your investments in crypto, stocks, and real estate with Payoneer Investment.
          </Typography>
          <Box
  component="img"
  src="https://static.vecteezy.com/system/resources/previews/010/877/409/non_2x/3d-illustration-exchange-ethereum-with-dollars-free-png.png"
  alt="Investment illustration"
  sx={{
    width: { xs: '100%', sm: '300px', md: '400px' },
    height: { xs: '200px', md: '300px' },
    objectFit: 'contain',
    mt: 2,
    mx: { xs: 'auto', md: 0 },
    boxShadow: 0, // Ensure this is set to 0
    borderRadius: 0, // Ensure this is set to 0
  }}
/>
        </motion.div>
      </Box>

      {/* Right: Form */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          maxWidth: { md: '50%' },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: '400px' },
              p: 4,
              borderRadius: 3,
              background: '#fff',
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#000', mb: 3 }}
            >
              Sign In
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontFamily: 'Inter, sans-serif' }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                sx={{ fontFamily: 'Inter, sans-serif' }}
                aria-label="Email address"
                variant="outlined"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                sx={{ fontFamily: 'Inter, sans-serif' }}
                aria-label="Password"
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
                  py: 1.5,
                  '&:hover': { background: '#1a6dc3', transform: 'scale(1.05)' },
                }}
              >
                Sign In
              </Button>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: 'center', fontFamily: 'Inter, sans-serif', color: '#666' }}
            >
              Don’t have an account?{' '}
              <Link to="/signup" style={{ color: '#2087EC', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SignIn;