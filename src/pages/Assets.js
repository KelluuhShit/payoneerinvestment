import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Skeleton,
  Button,
  Divider,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  Schedule,
  AttachMoney,
  MonetizationOn,
  HourglassEmpty,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Assets = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // No active investments initially
  const activeInvestments = useMemo(() => [], []);

  // Fallback image
  const fallbackImage = 'https://via.placeholder.com/120x100?text=Mining+Machine';

  const SkeletonInvestment = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, }}>
        {Array.from({ length: 2 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '120px',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Skeleton
              variant="rectangular"
              width={{ xs: 80, sm: 120 }}
              height={120}
              sx={{ borderRadius: '8px 0 0 8px' }}
            />
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Skeleton variant="text" width="60%" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
            </Box>
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: 3, pb: 8 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
          mb: 1,
        }}
      >
        Your Assets
      </Typography>

      {loading ? (
        <SkeletonInvestment />
      ) : activeInvestments.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 3, mr: 3 }}>
              {activeInvestments.map((item, index) => (
                <Card
                  key={index}
                  role="article"
                  aria-label={`${item.name} with ${item.usersInvested.toLocaleString()} users, ${item.change}% change, ${item.investmentPeriod} days period, $${item.dailyIncome} daily income, ${item.daysRemaining} days remaining`}
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
                    border: '1px solid #e0e0e0',
                    boxShadow: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    '&:hover': {
                      background: 'linear-gradient(180deg, #f5f5f Diesel Fuel For Life Men Eau De Toilette Spray, 4.2 Ounce5f5, #ffffff)',
                      boxShadow: 4,
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.target.src = fallbackImage)}
                    sx={{
                      width: { xs: '80px', sm: '120px' },
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px 0 0 8px',
                      loading: 'lazy',
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      p: { xs: 1, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#000',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        whiteSpace: 'normal',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccountBalanceWallet sx={{ fontSize: '1rem', color: '#2087EC' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#000',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Users: {item.usersInvested.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {item.change >= 0 ? (
                        <TrendingUp sx={{ fontSize: '1rem', color: '#2FDB6D' }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: '1rem', color: '#FE4600' }} />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: item.change >= 0 ? '#2FDB6D' : '#FE4600',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule sx={{ fontSize: '1rem', color: '#2087EC' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#000',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Investment Period: {item.investmentPeriod} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoney sx={{ fontSize: '1rem', color: '#2087EC' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#000',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Daily Income: ${item.dailyIncome.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MonetizationOn sx={{ fontSize: '1rem', color: '#2087EC' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#000',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Total Income: ${(item.dailyIncome * item.investmentPeriod).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <HourglassEmpty sx={{ fontSize: '1rem', color: '#2087EC' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#000',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Days Remaining: {item.daysRemaining}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        </motion.div>
      ) : (
        <Box sx={{ mt: 2, ml: 3, mr: 3, textAlign: 'center' }}>
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              fontFamily: 'Inter, sans-serif',
              mb: 2,
            }}
          >
            No active assets, invest now
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/invest')}
            aria-label="Navigate to Invest page"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 8,
              background: 'linear-gradient(180deg, #fff, #f5f5f5)',
              border: '1px solid #e0e0e0',
              boxShadow: 1,
              textTransform: 'none',
              color: '#000',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              '&:hover': {
                background: '#2087EC',
                color: '#fff',
                boxShadow: 3,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            Invest Now
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Assets;