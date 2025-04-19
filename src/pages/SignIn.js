import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

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
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/home');
    } catch (err) {
      setError(err.code === 'auth/wrong-password' ? 'Incorrect email or password.' : err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e8f0fe, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
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
  );
};

export default SignIn;