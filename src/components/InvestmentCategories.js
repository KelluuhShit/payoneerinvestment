import { useState, useEffect } from 'react';
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
  PhoneIphone,
  AccountBalance,
  Bolt,
  LocalBar,
  ShoppingBag,
  Newspaper,
  Business,
  LocalHospital,
  Agriculture,
  Factory,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const InvestmentCategories = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Banking & Finance');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    {
      icon: <PhoneIphone fontSize="small" />,
      name: 'Telecommunications',
      items: ['Safaricom PLC'],
    },
    {
      icon: <AccountBalance fontSize="small" />,
      name: 'Banking & Finance',
      items: [
        'Equity Group Holdings',
        'KCB Group',
        'Cooperative Bank of Kenya',
        'NCBA Group',
        'I&M Holdings',
        'Stanbic Holdings',
        'ABSA Bank Kenya',
      ],
    },
    {
      icon: <Bolt fontSize="small" />,
      name: 'Energy & Utilities',
      items: ['KenGen', 'Kenya Power (KPLC)', 'TotalEnergies Kenya', 'Umeme Ltd'],
    },
    {
      icon: (
        <Box sx={{ display: 'flex' }}>
          <LocalBar fontSize="small" />
          <ShoppingBag fontSize="small" sx={{ ml: 0.5 }} />
        </Box>
      ),
      name: 'Consumer Goods & Manufacturing',
      items: [
        'East African Breweries Ltd (EABL)',
        'BAT Kenya',
        'Bamburi Cement',
        'Carbacid Investments',
        'Mumias Sugar Company',
        'Eveready East Africa',
      ],
    },
    {
      icon: <Newspaper fontSize="small" />,
      name: 'Media',
      items: ['Nation Media Group (NMG)', 'Standard Group'],
    },
    {
      icon: <Business fontSize="small" />,
      name: 'Investment & Holdings',
      items: ['Centum Investment', 'TransCentury', 'NSE PLC'],
    },
    {
      icon: <LocalHospital fontSize="small" />,
      name: 'Healthcare',
      items: ['The Nairobi Hospital (planned listing)'],
    },
    {
      icon: (
        <Box sx={{ display: 'flex' }}>
          <Agriculture fontSize="small" />
          <Factory fontSize="small" sx={{ ml: 0.5 }} />
        </Box>
      ),
      name: 'Agriculture & Industry',
      items: ['Williamson Tea Kenya', 'Kapchorua Tea', 'Sasini Ltd'],
    },
  ];

  const filteredCategories = searchQuery
    ? categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.items.length > 0)
    : activeCategory === 'All'
    ? categories
    : categories.filter((category) => category.name === activeCategory);

  const SkeletonCategory = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={150} sx={{ fontSize: '1.25rem' }} />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 3 }}>
        {[1, 2, 3, 4].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={120}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
        Investment Categories
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {categories.slice(0, 5).map((category, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => setActiveCategory(category.name)}
            sx={{
                px: 1,
                py: 0.5,
                borderRadius: 8,
              background:
                activeCategory === category.name
                  ? '#2087EC'
                  : 'linear-gradient(180deg, #fff, #f5f5f5)',
              border: '1px solid #e0e0e0',
              boxShadow: 1,
              minWidth: '120px',
              textTransform: 'none',
              color: activeCategory === category.name ? '#fff' : '#000',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              '&:hover': {
                background:
                  activeCategory === category.name
                    ? '#1a6dc3'
                    : 'linear-gradient(180deg, #f5f5f5, #fff)',
                boxShadow: 3,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            {category.name}
          </Button>
        ))}
        {activeCategory === 'All' ? (
          <Button
            variant="contained"
            onClick={() => setActiveCategory('Banking & Finance')}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 8,
              background: '#2087EC',
              boxShadow: 1,
              minWidth: '80px',
              textTransform: 'none',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              '&:hover': {
                background: '#1a6dc3',
                boxShadow: 3,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            See Less
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => setActiveCategory('All')}
            sx={{
                px: 1,
                py: 0.5,
                borderRadius: 8,
              background: '#2087EC',
              boxShadow: 1,
              minWidth: '80px',
              textTransform: 'none',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              '&:hover': {
                background: '#1a6dc3',
                boxShadow: 3,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            See All
          </Button>
        )}
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="categories-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              id="categories-modal-title"
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#000',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              All Categories
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {categories.map((category, index) => (
            <Card
              key={index}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 2,
                background: 'linear-gradient(180deg, #fff, #f5f5f5)',
                border: '1px solid #e0e0e0',
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  mr: 1,
                  color: '#2087EC',
                }}
              >
                {category.icon}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: '#000',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                {category.name}
              </Typography>
            </Card>
          ))}
        </Box>
      </Modal>

      {loading ? (
        <>
          <SkeletonCategory />
          <SkeletonCategory />
          <SkeletonCategory />
          <SkeletonCategory />
        </>
      ) : (
        filteredCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    mr: 1,
                    color: '#2087EC',
                  }}
                >
                  {category.icon}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#000',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {category.name}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 3 }}>
                {category.items.map((item, itemIndex) => (
                  <Card
                    key={itemIndex}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(180deg, #fff, #f5f5f5)',
                      border: '1px solid #e0e0e0',
                      boxShadow: 1,
                      minWidth: '120px',
                      '&:hover': {
                        background: 'linear-gradient(180deg, #f5f5f5, #fff)',
                        boxShadow: 3,
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#000',
                        fontFamily: 'Inter, sans-serif',
                        textAlign: 'center',
                      }}
                    >
                      {item}
                    </Typography>
                  </Card>
                ))}
              </Box>

              {index < filteredCategories.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          </motion.div>
        ))
      )}
    </Box>
  );
};

export default InvestmentCategories;