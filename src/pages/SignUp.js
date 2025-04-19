import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

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
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.name });
      navigate('/home');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Email already in use.' : err.message);
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
  );
};

export default SignUp;