import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  Skeleton,
  Button,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const InvestmentCategories = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Popular');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for investments (Bitcoin mining machines with images)
  const investments = useMemo(
    () => [
      {
        name: 'Bitmain Antminer S21 Hyd',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: true,
        isNew: false,
        isHot: true,
        image: 'https://images.unsplash.com/photo-1620283089816-2763567',
      },
      {
        name: 'Bitmain Antminer S19 XP Hyd',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: true,
        isNew: false,
        isHot: false,
        image: 'https://images.unsplash.com/photo-1620283089816-2763568',
      },
      {
        name: 'MicroBT Whatsminer M50S',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: false,
        isNew: true,
        isHot: true,
        image: 'https://images.unsplash.com/photo-1620283089816-2763569',
      },
      {
        name: 'MicroBT Whatsminer M56S',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: true,
        isNew: true,
        isHot: false,
        image: 'https://images.unsplash.com/photo-1620283089816-2763570',
      },
      {
        name: 'Canaan Avalon Made A1366',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: false,
        isNew: false,
        isHot: true,
        image: 'https://images.unsplash.com/photo-1620283089816-2763571',
      },
      {
        name: 'Bitmain Antminer S19j Pro',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: true,
        isNew: false,
        isHot: false,
        image: 'https://images.unsplash.com/photo-1620283089816-2763572',
      },
      {
        name: 'MicroBT Whatsminer M63S',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: false,
        isNew: true,
        isHot: true,
        image: 'https://images.unsplash.com/photo-1620283089816-2763573',
      },
      {
        name: 'Bitmain Antminer S21 Pro',
        usersInvested: Math.floor(Math.random() * 45001 + 5000),
        change: (Math.random() * 10 - 5).toFixed(1),
        isPopular: true,
        isNew: false,
        isHot: false,
        image: 'https://images.unsplash.com/photo-1620283089816-2763574',
      },
    ],
    []
  );

  // Memoized filtered investments
  const filteredInvestments = useMemo(
    () =>
      investments
        .filter((item) => {
          if (activeFilter === 'Popular') return item.isPopular;
          if (activeFilter === 'New') return item.isNew;
          if (activeFilter === 'Hot') return item.isHot;
          return true;
        })
        .filter((item) =>
          searchQuery
            ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        ),
    [investments, activeFilter, searchQuery]
  );

  // Fallback image for broken URLs
  const fallbackImage =
    'https://via.placeholder.com/120x100?text=Mining+Machine';

  const SkeletonInvestment = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 3, mr: 3 }}>
        {Array.from({ length: Math.min(filteredInvestments.length || 2, 3) }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100px',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Skeleton
              variant="rectangular"
              width={{ xs: 80, sm: 120 }}
              height={100}
              sx={{ borderRadius: '8px 0 0 8px' }}
            />
            <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Skeleton variant="text" width="60%" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
              <Skeleton variant="text" width="30%" sx={{ fontSize: '0.75rem' }} />
            </Box>
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Bitcoin Mining Machines
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, ml: 3, mr: 3 }}>
        {['Popular', 'New', 'Hot'].map((filter, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => setActiveFilter(filter)}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 8,
              background:
                activeFilter === filter
                  ? '#2087EC'
                  : 'linear-gradient(180deg, #fff, #f5f5f5)',
              border: '1px solid #e0e0e0',
              boxShadow: 1,
              minWidth: '100px',
              textTransform: 'none',
              color: activeFilter === filter ? '#fff' : '#000',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              '&:hover': {
                background:
                  activeFilter === filter
                    ? '#1a6dc3'
                    : 'linear-gradient(180deg, #f5f5f5, #fff)',
                boxShadow: 3,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            {filter}
          </Button>
        ))}
      </Box>

      {loading ? (
        <SkeletonInvestment />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 3, mr: 3 }}>
              {filteredInvestments.length > 0 ? (
                filteredInvestments.map((item, index) => (
                  <Card
                    key={index}
                    role="article"
                    aria-label={`${item.name} with ${item.usersInvested.toLocaleString()} users and ${item.change}% change`}
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
                        background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
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
                        height: '100px',
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
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#000',
                    fontFamily: 'Inter, sans-serif',
                    ml: 3,
                  }}
                >
                  No mining machines found.
                </Typography>
              )}
            </Box>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default InvestmentCategories;