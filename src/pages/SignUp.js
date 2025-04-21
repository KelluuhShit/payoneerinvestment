import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, collection, addDoc, query, where, getDocs } from '../service/firebase';
import bcrypt from 'bcryptjs';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Invalid email format.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
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
        password: hashedPassword,
        createdAt: new Date(),
      });
      navigate('/');
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
            Join Payoneer Investment
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
            Start your journey to financial freedom with crypto mining, stocks, and real estate investments.
          </Typography>
          <Box
            component="img"
            src="https://static.vecteezy.com/system/resources/previews/010/877/536/non_2x/3d-illustration-ethereum-and-ring-free-png.png"
            alt="Investment illustration"
            sx={{
              width: { xs: '100%', sm: '300px', md: '400px' },
              height: { xs: '200px', md: '300px' },
              objectFit: 'contain',
              borderRadius: 3,
              boxShadow: 3,
              mt: 2,
              mx: { xs: 'auto', md: 0 },
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
              Sign Up
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontFamily: 'Inter, sans-serif' }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                sx={{ fontFamily: 'Inter, sans-serif' }}
                aria-label="Full name"
                variant="outlined"
              />
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
                Create Account
              </Button>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: 'center', fontFamily: 'Inter, sans-serif', color: '#666' }}
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