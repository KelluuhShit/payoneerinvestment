import { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import InvestmentCard from '../components/InvestmentCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion } from 'framer-motion';

// Placeholder PNGs (replace with actual assets in public/assets)
const stockIcon = '/assets/stock.png';
const cryptoIcon = '/assets/crypto.png';
const realEstateIcon = '/assets/real-estate.png';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const investments = [
    {
      title: 'Stock Portfolio',
      amount: '$12,450.75',
      icon: stockIcon,
      gradient: 'linear-gradient(135deg, #2FDB6D, #2087EC)',
    },
    {
      title: 'Crypto Holdings',
      amount: '$8,230.10',
      icon: cryptoIcon,
      gradient: 'linear-gradient(135deg, #2087EC, #D951D5)',
    },
    {
      title: 'Real Estate Fund',
      amount: '$15,780.00',
      icon: realEstateIcon,
      gradient: 'linear-gradient(135deg, #D951D5, #FE4600)',
    },
  ];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: '#fff', mb: 4, fontWeight: 'bold' }}
        >
          Payoneer Investment
        </Typography>
      </motion.div>

      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        investments.map((inv, index) => (
          <InvestmentCard
            key={index}
            title={inv.title}
            amount={inv.amount}
            icon={inv.icon}
            gradient={inv.gradient}
          />
        ))
      )}

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            background: 'linear-gradient(135deg, #F29104, #2FDB6D)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #E5C300, #2087EC)',
            },
          }}
        >
          Invest Now
        </Button>
      </motion.div>
    </Box>
  );
};

export default Home;