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
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Invest = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [openInvestModal, setOpenInvestModal] = useState(null); // Track modal for specific item
  const [investmentsMade, setInvestmentsMade] = useState([]); // Mock state for investments

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Real data for investments (KES, increasing investment amounts, with filter categories)
  const investments = useMemo(
    () => [
      {
        name: 'Bitmain Antminer S21 Hyd',
        activeInvestors: 5000,
        image: 'https://asic-miner-profitability.com/profit/images/miners/webp/bitmain_antminer_s19_hydrodesign_image3.webp',
        investmentPeriod: 7,
        investmentAmount: 500,
        dailyIncome: 500 * 0.1, // KES 50
        totalIncome: 500 * 0.1 * 7, // KES 350
        isPopular: true,
        isNew: true,
        isHot: false,
      },
      {
        name: 'Bitmain Antminer S19 XP Hyd',
        activeInvestors: 4500,
        image: 'https://mining-now.s3.us-east-2.amazonaws.com/prod/asic-miner/bitmain-antminer-s19-xp-134th-s/antminer-s19-xp-ok-1708068838352.png',
        investmentPeriod: 7,
        investmentAmount: 1000,
        dailyIncome: 1000 * 0.1, // KES 100
        totalIncome: 1000 * 0.1 * 7, // KES 700
        isPopular: true,
        isNew: false,
        isHot: false,
      },
      {
        name: 'MicroBT Whatsminer M50S',
        activeInvestors: 4000,
        image: 'https://www.theminingshop.co.uk/wp-content/uploads/2023/11/MicroBT-Whatsminer-M50-128th-MicroBT-miner-Buy-Asic-miner-Front.png',
        investmentPeriod: 7,
        investmentAmount: 1500,
        dailyIncome: 1500 * 0.1, // KES 150
        totalIncome: 1500 * 0.1 * 7, // KES 1050
        isPopular: false,
        isNew: false,
        isHot: false,
      },
      {
        name: 'MicroBT Whatsminer M56S',
        activeInvestors: 4200,
        image: 'https://viperatech.com/wp-content/uploads/2022/01/c6c1fb70-bbe0-47cb-a365-54b548a4741a_540-1-300x300.png',
        investmentPeriod: 7,
        investmentAmount: 2000,
        dailyIncome: 2000 * 0.1, // KES 200
        totalIncome: 2000 * 0.1 * 7, // KES 1400
        isPopular: false,
        isNew: false,
        isHot: false,
      },
      {
        name: 'Canaan Avalon Made A1366',
        activeInvestors: 3800,
        image: 'https://images.hashrate.no/ba94767e44b03fb9d2c91975495bbf8d.png',
        investmentPeriod: 7,
        investmentAmount: 2500,
        dailyIncome: 2500 * 0.1, // KES 250
        totalIncome: 2500 * 0.1 * 7, // KES 1750
        isPopular: false,
        isNew: false,
        isHot: false,
      },
      {
        name: 'Bitmain Antminer S19j Pro',
        activeInvestors: 4100,
        image: 'https://asic-miner-profitability.com/profit/images/miners/allminer.png',
        investmentPeriod: 7,
        investmentAmount: 3000,
        dailyIncome: 3000 * 0.1, // KES 300
        totalIncome: 3000 * 0.1 * 7, // KES 2100
        isPopular: false,
        isNew: false,
        isHot: true,
      },
      {
        name: 'MicroBT Whatsminer M63S',
        activeInvestors: 4300,
        image: 'https://mining-now.s3.us-east-2.amazonaws.com/prod/asic-miner/microbt-whatsminer-m66s-310th-s/microbt-whatsminer-m66s-1709137516544.png',
        investmentPeriod: 7,
        investmentAmount: 3500,
        dailyIncome: 3500 * 0.1, // KES 350
        totalIncome: 3500 * 0.1 * 7, // KES 2450
        isPopular: false,
        isNew: true,
        isHot: true,
      },
      {
        name: 'Bitmain Antminer S21 Pro',
        activeInvestors: 4800,
        image: 'https://www.bitmart.co.za/wp-content/uploads/2024/07/Antminer-KS5Pro-21th-NEW.png',
        investmentPeriod: 7,
        investmentAmount: 4000,
        dailyIncome: 4000 * 0.1, // KES 400
        totalIncome: 4000 * 0.1 * 7, // KES 2800
        isPopular: true,
        isNew: true,
        isHot: true,
      },
    ],
    []
  );

  // Memoized filtered investments (apply filter and searchQuery)
  const filteredInvestments = useMemo(
    () =>
      investments
        .filter((item) => {
          if (activeFilter === 'Popular') return item.isPopular;
          if (activeFilter === 'New') return item.isNew;
          if (activeFilter === 'Hot') return item.isHot;
          return true; // Fallback (shouldn't occur)
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
    setOpenInvestModal(null);
  };

  // Fallback image
  const fallbackImage = '/assets/mining-machine-placeholder.jpg';

  const SkeletonInvestment = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
    <Box sx={{ p: 2, pb: 8 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
          mb: 1,
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
                    aria-label={`${item.name} with ${item.activeInvestors.toLocaleString()} active investors, ${item.investmentPeriod} days period, KES ${item.dailyIncome.toFixed(2)} daily income, KES ${item.investmentAmount.toFixed(2)} investment`}
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
          onClose={() => setOpenInvestModal(null)}
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
                onClick={() => setOpenInvestModal(null)}
                aria-label="Close modal"
              >
                <Close />
              </IconButton>
            </Box>
            <Typography
              id="invest-modal-description"
              variant="body2"
              sx={{
                mt: 2,
                fontFamily: 'Inter, sans-serif',
                color: '#666',
              }}
            >
              Confirm investment of KES {openInvestModal.investmentAmount.toFixed(2)} for a {openInvestModal.investmentPeriod}-day period.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={() => setOpenInvestModal(null)}
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

export default Invest;