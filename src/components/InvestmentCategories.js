import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  Skeleton,
  Button,
  Modal,
  IconButton,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Schedule,
  AttachMoney,
  MonetizationOn,
  Close,
  CurrencyExchange,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const InvestmentCategories = ({ searchQuery, onInvest, showModal, setShowModal }) => {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [openInvestModal, setOpenInvestModal] = useState(null);
  const [investmentsMade, setInvestmentsMade] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showModal) {
      setOpenInvestModal({ name: 'Select an investment' });
    }
  }, [showModal]);

  // Mock data for investments (KES, with interest)
  const investments = useMemo(
    () => [
      {
        name: 'Bitmain Antminer S21 Hyd',
        activeInvestors: 5000,
        investmentPeriod: 7,
        investmentAmount: 500,
        dailyIncome: 500 * 0.1, // KES 50
        totalIncome: 500 * 0.1 * 7, // KES 350
        interest: (500 * 0.1 / 500) * 100, // 10%
        isPopular: true,
        isNew: false,
        isHot: true,
        image: '/assets/antminer-s21-hyd.jpg',
      },
      {
        name: 'Bitmain Antminer S19 XP Hyd',
        activeInvestors: 4500,
        investmentPeriod: 7,
        investmentAmount: 1000,
        dailyIncome: 1000 * 0.1, // KES 100
        totalIncome: 1000 * 0.1 * 7, // KES 700
        interest: (1000 * 0.1 / 1000) * 100, // 10%
        isPopular: true,
        isNew: false,
        isHot: false,
        image: '/assets/antminer-s19-xp-hyd.jpg',
      },
      {
        name: 'MicroBT Whatsminer M50S',
        activeInvestors: 4000,
        investmentPeriod: 7,
        investmentAmount: 1500,
        dailyIncome: 1500 * 0.1, // KES 150
        totalIncome: 1500 * 0.1 * 7, // KES 1050
        interest: (1500 * 0.1 / 1500) * 100, // 10%
        isPopular: false,
        isNew: true,
        isHot: true,
        image: '/assets/whatsminer-m50s.jpg',
      },
      {
        name: 'MicroBT Whatsminer M56S',
        activeInvestors: 4200,
        investmentPeriod: 7,
        investmentAmount: 2000,
        dailyIncome: 2000 * 0.1, // KES 200
        totalIncome: 2000 * 0.1 * 7, // KES 1400
        interest: (2000 * 0.1 / 2000) * 100, // 10%
        isPopular: true,
        isNew: true,
        isHot: false,
        image: '/assets/whatsminer-m56s.jpg',
      },
      {
        name: 'Canaan Avalon Made A1366',
        activeInvestors: 3800,
        investmentPeriod: 7,
        investmentAmount: 2500,
        dailyIncome: 2500 * 0.1, // KES 250
        totalIncome: 2500 * 0.1 * 7, // KES 1750
        interest: (2500 * 0.1 / 2500) * 100, // 10%
        isPopular: false,
        isNew: false,
        isHot: true,
        image: '/assets/avalon-a1366.jpg',
      },
      {
        name: 'Bitmain Antminer S19j Pro',
        activeInvestors: 4100,
        investmentPeriod: 7,
        investmentAmount: 3000,
        dailyIncome: 3000 * 0.1, // KES 300
        totalIncome: 3000 * 0.1 * 7, // KES 2100
        interest: (3000 * 0.1 / 3000) * 100, // 10%
        isPopular: true,
        isNew: false,
        isHot: false,
        image: '/assets/antminer-s19j-pro.jpg',
      },
      {
        name: 'MicroBT Whatsminer M63S',
        activeInvestors: 4300,
        investmentPeriod: 7,
        investmentAmount: 3500,
        dailyIncome: 3500 * 0.1, // KES 350
        totalIncome: 3500 * 0.1 * 7, // KES 2450
        interest: (3500 * 0.1 / 3500) * 100, // 10%
        isPopular: false,
        isNew: true,
        isHot: true,
        image: '/assets/whatsminer-m63s.jpg',
      },
      {
        name: 'Bitmain Antminer S21 Pro',
        activeInvestors: 4800,
        investmentPeriod: 7,
        investmentAmount: 4000,
        dailyIncome: 4000 * 0.1, // KES 400
        totalIncome: 4000 * 0.1 * 7, // KES 2800
        interest: (4000 * 0.1 / 4000) * 100, // 10%
        isPopular: true,
        isNew: false,
        isHot: false,
        image: '/assets/antminer-s21-pro.jpg',
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

  // Handle investment confirmation
  const handleInvest = (item) => {
    const investment = {
      ...item,
      timestamp: new Date().toISOString(),
      daysRemaining: item.investmentPeriod,
    };
    setInvestmentsMade((prev) => [...prev, investment]);
    console.log('Investment made:', investment);
    onInvest(investment);
    setOpenInvestModal(null);
    setShowModal(false);
  };

  // Fallback image
  const fallbackImage = 'https://via.placeholder.com/120x100?text=Mining+Machine';

  const SkeletonInvestment = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1,  }}>
        {Array.from({ length: Math.min(filteredInvestments.length || 2, 3) }).map(
          (_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '140px',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Skeleton
                variant="rectangular"
                width={{ xs: 80, sm: 120 }}
                height={140}
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
                <Skeleton variant="text" width="30%" sx={{ fontSize: '0.75rem' }} />
                <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
                <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
                <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
                <Skeleton variant="text" width="60%" sx={{ fontSize: '0.875rem' }} />
              </Box>
            </Box>
          )
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  return (
    <Box sx={{ mt: 1, pb: 8, }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Available Investments
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {filteredInvestments.length > 0 ? (
                filteredInvestments.map((item, index) => (
                  <Card
                    key={index}
                    role="article"
                    aria-label={`${item.name} with ${item.activeInvestors.toLocaleString()} active investors, ${item.interest.toFixed(1)}% daily interest, ${item.investmentPeriod} days period, KES ${item.dailyIncome.toFixed(2)} daily income, KES ${item.investmentAmount.toFixed(2)} investment`}
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
                        height: '140px',
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
                          Active Investors: {item.activeInvestors.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp sx={{ fontSize: '1rem', color: '#2FDB6D' }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#2FDB6D',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                          }}
                        >
                          +{item.interest.toFixed(1)}%
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
                          Daily Income: KES {item.dailyIncome.toFixed(2)}
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
                          Total Income: KES {item.totalIncome.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CurrencyExchange sx={{ fontSize: '1rem', color: '#2087EC' }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#000',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                          }}
                        >
                          Investment Amount: KES {item.investmentAmount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => setOpenInvestModal(item)}
                        sx={{
                          mt: 1,
                          px: 2,
                          py: 0.5,
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
                        aria-label={`Invest in ${item.name}`}
                      >
                        Invest Now
                      </Button>
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

      {/* Investment Modal */}
      {openInvestModal && (
        <Modal
          open={!!openInvestModal}
          onClose={() => {
            setOpenInvestModal(null);
            setShowModal(false);
          }}
          aria-labelledby="invest-modal-title"
          aria-describedby="invest-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '80%', sm: 400 },
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: 24,
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                id="invest-modal-title"
                variant="h6"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                }}
              >
                Invest in {openInvestModal.name}
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenInvestModal(null);
                  setShowModal(false);
                }}
                aria-label="Close modal"
              >
                <Close />
              </IconButton>
            </Box>
            <Box id="invest-modal-description" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccountBalanceWallet sx={{ fontSize: '1rem', color: '#2087EC' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#666',
                  }}
                >
                  Active Investors: {openInvestModal.activeInvestors.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: '1rem', color: '#2FDB6D' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#666',
                  }}
                >
                  Daily Interest: +{openInvestModal.interest.toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule sx={{ fontSize: '1rem', color: '#2087EC' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#666',
                  }}
                >
                  Investment Period: {openInvestModal.investmentPeriod} days
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AttachMoney sx={{ fontSize: '1rem', color: '#2087EC' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#666',
                  }}
                >
                  Daily Income: KES {openInvestModal.dailyIncome.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MonetizationOn sx={{ fontSize: '1rem', color: '#2087EC' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#666',
                  }}
                >
                  Total Income: KES {openInvestModal.totalIncome.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CurrencyExchange sx={{ fontSize: '1rem', color: '#2087EC' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    color: '#666',
                  }}
                >
                  Investment Amount: KES {openInvestModal.investmentAmount.toFixed(2)}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontFamily: 'Inter, sans-serif',
                  color: '#666',
                }}
              >
                Confirm investment of KES {openInvestModal.investmentAmount.toFixed(2)} for a {openInvestModal.investmentPeriod}-day period.
              </Typography>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={() => {
                  setOpenInvestModal(null);
                  setShowModal(false);
                }}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
                aria-label="Cancel investment"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleInvest(openInvestModal)}
                sx={{
                  background: '#2087EC',
                  color: '#fff',
                  borderRadius: 8,
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': {
                    background: '#1a6dc3',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                aria-label={`Confirm investment of KES ${openInvestModal.investmentAmount.toFixed(2)} in ${openInvestModal.name}`}
              >
                Confirm Investment
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default InvestmentCategories;