import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  TrendingUp as TrendingUpIcon,
  MoreHoriz as MoreHorizIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import InvestmentCategories from '../components/InvestmentCategories';
import { motion } from 'framer-motion';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generate random KSH amount between 10,000 and 100,000
  const randomKSH = `KSH ${(Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000).toLocaleString()}`;

  return (
    <Box sx={{ ml: 2, mr: 2, mt: 2 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #2087EC, #D951D5)',
            boxShadow: 3,
            p: 2,
            marginLeft: '-16px',
            marginRight: '-16px',
            marginTop: '-16px',
            borderRadius: '0 0 20px 20px',
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 0 }}>
            <IconButton sx={{ fontSize: '1rem', backgroundColor: '#fff' }}>
              <PersonIcon />
            </IconButton>
            <Paper
              component="div"
              sx={{
                flex: 1,
                p: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                mx: 1,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, color: '#fff', fontFamily: 'Inter, sans-serif' }}
                placeholder="Search investments..."
                inputProps={{ 'aria-label': 'search investments' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton sx={{ color: '#fff', p: '4px' }}>
                <SearchIcon sx={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Paper>
            <IconButton sx={{ fontSize: '1rem', backgroundColor: '#fff' }}>
              <NotificationsIcon />
            </IconButton>
          </CardContent>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography
              sx={{ color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Current Wallet Balance
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#fff', fontFamily: 'Roboto Mono, sans-serif', fontWeight: 400, mt: 1, fontSize: '2rem' }}
            >
              {randomKSH}
            </Typography>
          </Box>
          <Card
            sx={{
              mt: 2,
              mx: 'auto',
              px: 1,
              py: 0.5,
              borderRadius: 8,
              backgroundColor: '#fff',
              maxWidth: '120px',
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.7rem',
                color: '#2FDB6D',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              4hrs change +2.3%
            </Typography>
          </Card>
          <Card
            sx={{
              mt: 2,
              mx: 'auto',
              px: 2,
              py: 2,
              borderRadius: 5,
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton sx={{ color: '#F29104', p: 1 }}>
                  <AddCircleOutlineIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                >
                  Top Up
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton sx={{ color: '#FE4600', p: 1 }}>
                  <RemoveCircleOutlineIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                >
                  Withdraw
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton sx={{ color: '#2FDB6D', p: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                >
                  Investments
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton sx={{ color: '#2087EC', p: 1 }}>
                  <MoreHorizIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ color: '##000', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                >
                  More
                </Typography>
              </Box>
            </Box>
          </Card>
          <Typography
            align="center"
            sx={{ color: '#fff', mt: 2, fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.7rem' }}
          >
            Payoneer Investment
            <SecurityIcon sx={{ color: '#fff', fontSize: '0.8rem', ml: 0.5 }} />
          </Typography>
        </Card>
      </motion.div>

      <InvestmentCategories searchQuery={searchQuery} />

    </Box>
  );
};

export default Home;