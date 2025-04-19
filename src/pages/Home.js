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
  Modal,
  TextField,
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
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import InvestmentCategories from '../components/InvestmentCategories';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [balance, setBalance] = useState(0.00);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [hasInvested, setHasInvested] = useState(false);
  const [openTopUpModal, setOpenTopUpModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [topUpError, setTopUpError] = useState('');
  const [topUpSuccess, setTopUpSuccess] = useState('');
  const [openBalanceModal, setOpenBalanceModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const navigate = useNavigate();

  // Mock user data (sync with Profile.js)
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    referralCode: 'REF123',
    referralLink: 'https://app.example.com/ref/REF123',
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Capture beforeinstallprompt event for PWA
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Handle Top Up modal
  const handleTopUp = () => {
    setOpenTopUpModal(true);
    setDepositAmount('');
    setTopUpError('');
    setTopUpSuccess('');
  };

  const handleConfirmTopUp = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      setTopUpError('Please enter a valid amount.');
      return;
    }
    setBalance((prev) => prev + amount);
    setTopUpSuccess(`Deposited KES ${amount.toFixed(2)} successfully.`);
    setTopUpError('');
    console.log(`Deposited KES ${amount.toFixed(2)}`);
    // Store in Firestore
    // db.collection('users').doc(userId).update({ balance: balance + amount });
    setTimeout(() => setOpenTopUpModal(false), 1000); // Close after 1s
  };

  // Handle investment from InvestmentCategories
  const handleInvestment = (investment) => {
    if (balance >= investment.investmentAmount) {
      setBalance((prev) => prev - investment.investmentAmount);
      setSelectedInvestment(investment);
      setHasInvested(true);
      console.log('Investment selected:', investment);
      // Store in Firestore
      // db.collection('users').doc(userId).collection('investments').add({ ...investment, startTime: new Date() });
    } else {
      setOpenBalanceModal(true);
    }
  };

  // Update balance every 4 hours
  useEffect(() => {
    if (hasInvested && selectedInvestment) {
      const interval = setInterval(() => {
        const increment = selectedInvestment.dailyIncome / 6; // 4 hours = 1/6 day
        setBalance((prev) => {
          const newBalance = prev + increment;
          const maxBalance = prev + selectedInvestment.totalIncome;
          return newBalance <= maxBalance ? newBalance : maxBalance;
        });
      }, 4 * 60 * 60 * 1000); // 4 hours
      return () => clearInterval(interval);
    }
  }, [hasInvested, selectedInvestment]);

  // Handle copy referral link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.referralLink);
    alert('Referral link copied to clipboard!');
  };

  // Handle PWA installation
  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed');
        setInstallPrompt(null);
      } else {
        console.log('PWA installation dismissed');
      }
    } else {
      alert('To install the app, use a PWA-compatible browser and select "Add to Home Screen".');
    }
  };

  // Handle share app
  const handleShare = async () => {
    const shareData = {
      title: 'Payoneer Investment',
      text: 'Join me on Payoneer Investment to start investing today!',
      url: 'https://app.example.com',
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('App shared successfully');
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      setOpenShareModal(true);
    }
  };

  // Handle log out
  const handleLogout = () => {
    // Mock: Clear auth state (replace with Firebase Auth)
    // auth.signOut();
    navigate('/login');
  };

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
            <IconButton
              sx={{ fontSize: '1rem', backgroundColor: '#fff' }}
              onClick={() => setOpenProfileModal(true)}
              aria-label="Open profile"
            >
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
            <IconButton
              sx={{ fontSize: '1rem', backgroundColor: '#fff' }}
              onClick={() => setOpenNotificationsModal(true)}
              aria-label="Open notifications"
            >
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
              KSH {balance.toFixed(2)}
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
            {hasInvested && selectedInvestment ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: '1rem', color: '#2FDB6D' }} />
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#2FDB6D',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  +{selectedInvestment.interest.toFixed(1)}%
                </Typography>
              </Box>
            ) : (
              <Button
                onClick={() => window.scrollTo({ top: document.getElementById('available-investments').offsetTop, behavior: 'smooth' })}
                sx={{
                  fontSize: '0.7rem',
                  color: '#2FDB6D',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  textAlign: 'center',
                  textTransform: 'none',
                }}
                aria-label="Invest now"
              >
                Invest Now
              </Button>
            )}
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
                <IconButton sx={{ color: '#F29104', p: 1 }} onClick={handleTopUp}>
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
                  sx={{ color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
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

      {/* Profile Modal */}
      <Modal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
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
              id="profile-modal-title"
              variant="h6"
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Profile
            </Typography>
            <IconButton onClick={() => setOpenProfileModal(false)} aria-label="Close profile modal">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="profile-modal-description" sx={{ mt: 2 }}>
            <Typography
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#000' }}
            >
              Name: {user.name}
            </Typography>
            <Typography
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#000', mt: 1 }}
            >
              Email: {user.email}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#2087EC' }}
              >
                Referral Code: {user.referralCode}
              </Typography>
              <IconButton
                onClick={handleCopyLink}
                aria-label="Copy referral link"
                sx={{ color: '#2087EC' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleInstall}
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
              aria-label="Install app"
            >
              Install App
            </Button>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleShare}
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
              aria-label="Share app"
            >
              Share App
            </Button>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
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
              aria-label="Log out"
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        open={openNotificationsModal}
        onClose={() => setOpenNotificationsModal(false)}
        aria-labelledby="notifications-modal-title"
        aria-describedby="notifications-modal-description"
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
              id="notifications-modal-title"
              variant="h6"
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Notifications
            </Typography>
            <IconButton onClick={() => setOpenNotificationsModal(false)} aria-label="Close notifications modal">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="notifications-modal-description" sx={{ mt: 2 }}>
            <Typography
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#666' }}
            >
              No notifications yet.
            </Typography>
          </Box>
        </Box>
      </Modal>

      {/* Share Modal (Fallback for non-Web Share browsers) */}
      <Modal
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
        aria-labelledby="share-modal-title"
        aria-describedby="share-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              id="share-modal-title"
              variant="h6"
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Share App
            </Typography>
            <IconButton onClick={() => setOpenShareModal(false)} aria-label="Close share modal">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="share-modal-description" sx={{ mt: 2 }}>
            <Typography
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#666' }}
            >
              Copy the link below to share the app:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#2087EC' }}
              >
                https://app.example.com
              </Typography>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText('https://app.example.com');
                  alert('Link copied to clipboard!');
                }}
                aria-label="Copy app link"
                sx={{ color: '#2087EC' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Top Up Modal */}
      <Modal
        open={openTopUpModal}
        onClose={() => setOpenTopUpModal(false)}
        aria-labelledby="top-up-modal-title"
        aria-describedby="top-up-modal-description"
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
              id="top-up-modal-title"
              variant="h6"
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Top Up Balance
            </Typography>
            <IconButton onClick={() => setOpenTopUpModal(false)} aria-label="Close modal">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="top-up-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Deposit Amount (KES)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              error={!!topUpError}
              helperText={topUpError}
            />
            {topUpSuccess && (
              <Typography
                sx={{
                  mt: 2,
                  color: '#2FDB6D',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                {topUpSuccess}
              </Typography>
            )}
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={() => setOpenTopUpModal(false)}
              sx={{
                color: '#666',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              aria-label="Cancel top up"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmTopUp}
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
              aria-label="Confirm top up"
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Insufficient Balance Modal */}
      <Modal
        open={openBalanceModal}
        onClose={() => setOpenBalanceModal(false)}
        aria-labelledby="balance-modal-title"
        aria-describedby="balance-modal-description"
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
              id="balance-modal-title"
              variant="h6"
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Insufficient Balance
            </Typography>
            <IconButton onClick={() => setOpenBalanceModal(false)} aria-label="Close modal">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="balance-modal-description" sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                color: '#666',
                fontWeight: 500,
              }}
            >
              Insufficient balance. Please top up.
            </Typography>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={() => setOpenBalanceModal(false)}
              sx={{
                color: '#666',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              aria-label="Close insufficient balance modal"
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpenBalanceModal(false);
                handleTopUp();
              }}
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
              aria-label="Top up balance"
            >
              Top Up
            </Button>
          </Box>
        </Box>
      </Modal>

      <InvestmentCategories
        searchQuery={searchQuery}
        onInvest={handleInvestment}
      />
    </Box>
  );
};

export default Home;