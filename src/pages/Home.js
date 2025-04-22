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
  CircularProgress,
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
import { db, doc, getDoc, updateDoc, addDoc, collection, runTransaction, serverTimestamp } from '../service/firebase';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://payoneerinvestment.vercel.app/' : 'http://localhost:3000';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [balance, setBalance] = useState(0.00);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [hasInvested, setHasInvested] = useState(false);
  const [openTopUpModal, setOpenTopUpModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [depositData, setDepositData] = useState({ phoneNumber: '', amount: '' });
  const [withdrawData, setWithdrawData] = useState({ phoneNumber: '', amount: '' });
  const [topUpError, setTopUpError] = useState('');
  const [topUpSuccess, setTopUpSuccess] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [openBalanceModal, setOpenBalanceModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Validate authentication and fetch user data on mount
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/signin', { replace: true });
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
          localStorage.removeItem('userId');
          navigate('/signin', { replace: true });
          return;
        }
        const userData = userDoc.data();
        setUser({
          id: userId,
          name: userData.name || 'Unknown User',
          email: userData.email || 'No email provided',
          referralCode: userData.referralCode || 'REF000',
          referralLink:
            userData.referralLink ||
            `https://payoneerinvestment.vercel.app/${userData.referralCode || 'REF000'}`,
        });
        setBalance(userData.balance || 0.00);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('userId');
        navigate('/signin', { replace: true });
      }
    };
    checkAuthAndFetchUser();
  }, [navigate]);

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
    setDepositData({ phoneNumber: '', amount: '' });
    setTopUpError('');
    setTopUpSuccess('');
  };

  // Handle Withdraw modal
  const handleWithdraw = () => {
    setOpenWithdrawModal(true);
    setWithdrawData({ phoneNumber: '', amount: '' });
    setWithdrawError('');
    setWithdrawSuccess('');
  };

  // Handle deposit
  const handleConfirmTopUp = async () => {
    if (!depositData.phoneNumber || !depositData.amount) {
      setTopUpError('Please enter phone number and amount.');
      return;
    }
    const phoneRegex = /^(?:254|0)7\d{8}$/;
    if (!phoneRegex.test(depositData.phoneNumber)) {
      setTopUpError('Phone number must be 254XXXXXXXXX or 07XXXXXXXX');
      return;
    }
    const amount = Number(depositData.amount);
    if (isNaN(amount) || amount <= 0) {
      setTopUpError('Amount must be a positive number.');
      return;
    }
    setDepositLoading(true);
    setTopUpError('');
    setTopUpSuccess('');
    try {
      const reference = `DEP-${Date.now()}-${user.id}`;
      const response = await axios.post(`${API_BASE_URL}/api/payhero-stk-push`, {
        phoneNumber: depositData.phoneNumber,
        amount,
        reference,
      });
      if (response.data.success) {
        const txRef = await addDoc(collection(db, `users/${user.id}/transactions`), {
          type: 'deposit',
          amount,
          status: 'QUEUED',
          reference,
          createdAt: serverTimestamp(),
        });
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const statusResponse = await axios.get(`${API_BASE_URL}/api/transaction-status?reference=${reference}`);
            const { status } = statusResponse.data;
            await updateDoc(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
            if (status === 'SUCCESS') {
              await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.id);
                const userDoc = await transaction.get(userRef);
                const newBalance = (userDoc.data().balance || 0) + amount;
                transaction.update(userRef, { balance: newBalance });
                transaction.update(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
              });
              setBalance((prev) => prev + amount);
              setTopUpSuccess(`Deposited KES ${amount.toFixed(2)} successfully.`);
              clearInterval(interval);
              setDepositData({ phoneNumber: '', amount: '' });
              setTimeout(() => setOpenTopUpModal(false), 1000);
            } else if (status === 'FAILED' || status === 'CANCELLED' || attempts >= 30) {
              setTopUpError(`Deposit ${status.toLowerCase()}.`);
              clearInterval(interval);
            }
          } catch (err) {
            console.error('Status poll error:', err.message);
            if (attempts >= 30) {
              setTopUpError('Deposit timed out.');
              clearInterval(interval);
            }
          }
        }, 5000);
      } else {
        setTopUpError(response.data.error || 'Failed to initiate deposit.');
      }
    } catch (err) {
      console.error('Deposit error:', err);
      if (err.response?.status === 404) {
        setTopUpError('Deposit API not found. Please check server configuration.');
      } else {
        setTopUpError(err.response?.data?.error || 'Network error. Please try again.');
      }
    } finally {
      setDepositLoading(false);
    }
  };

  // Handle withdrawal
  const handleConfirmWithdraw = async () => {
    if (!withdrawData.phoneNumber || !withdrawData.amount) {
      setWithdrawError('Please enter phone number and amount.');
      return;
    }
    const phoneRegex = /^(?:254|0)7\d{8}$/;
    if (!phoneRegex.test(withdrawData.phoneNumber)) {
      setWithdrawError('Phone number must be 254XXXXXXXXX or 07XXXXXXXX');
      return;
    }
    const amount = Number(withdrawData.amount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Amount must be a positive number.');
      return;
    }
    if (amount > balance) {
      setWithdrawError('Insufficient balance.');
      return;
    }
    setWithdrawLoading(true);
    setWithdrawError('');
    setWithdrawSuccess('');
    try {
      const reference = `WDR-${Date.now()}-${user.id}`;
      const response = await axios.post(`${API_BASE_URL}/api/payhero-payout`, {
        phoneNumber: withdrawData.phoneNumber,
        amount,
        reference,
        userId: user.id,
      });
      if (response.data.success) {
        const txRef = await addDoc(collection(db, `users/${user.id}/transactions`), {
          type: 'withdrawal',
          amount,
          status: 'QUEUED',
          reference,
          createdAt: serverTimestamp(),
        });
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const statusResponse = await axios.get(`${API_BASE_URL}/api/transaction-status?reference=${reference}`);
            const { status } = statusResponse.data;
            await updateDoc(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
            if (status === 'SUCCESS') {
              await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.id);
                const userDoc = await transaction.get(userRef);
                const newBalance = (userDoc.data().balance || 0) - amount;
                transaction.update(userRef, { balance: newBalance });
                transaction.update(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
              });
              setBalance((prev) => prev - amount);
              setWithdrawSuccess(`Withdrawn KES ${amount.toFixed(2)} successfully.`);
              clearInterval(interval);
              setWithdrawData({ phoneNumber: '', amount: '' });
              setTimeout(() => setOpenWithdrawModal(false), 1000);
            } else if (status === 'FAILED' || status === 'CANCELLED' || attempts >= 30) {
              setWithdrawError(`Withdrawal ${status.toLowerCase()}.`);
              clearInterval(interval);
            }
          } catch (err) {
            console.error('Status poll error:', err);
            if (attempts >= 30) {
              setWithdrawError('Withdrawal timed out.');
              clearInterval(interval);
            }
          }
        }, 5000);
      } else {
        setWithdrawError(response.data.error || 'Failed to initiate withdrawal.');
      }
    } catch (err) {
      setWithdrawError(err.response?.data?.error || 'An error occurred during withdrawal.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Handle investment from InvestmentCategories
  const handleInvestment = async (investment) => {
    if (balance >= investment.investmentAmount) {
      const newBalance = balance - investment.investmentAmount;
      setBalance(newBalance);
      setSelectedInvestment(investment);
      setHasInvested(true);
      console.log('Investment selected:', investment);
      const userId = localStorage.getItem('userId');
      try {
        await updateDoc(doc(db, 'users', userId), { balance: newBalance });
        await addDoc(collection(db, 'users', userId, 'investments'), {
          ...investment,
          startTime: new Date(),
        });
      } catch (err) {
        console.error('Error saving investment:', err);
        setBalance(balance);
        return;
      }
    } else {
      setOpenBalanceModal(true);
    }
  };

  // Update balance every 4 hours
  useEffect(() => {
    if (hasInvested && selectedInvestment) {
      const interval = setInterval(async () => {
        const increment = selectedInvestment.dailyIncome / 6;
        const newBalance = balance + increment;
        const maxBalance = balance + selectedInvestment.totalIncome;
        const updatedBalance = newBalance <= maxBalance ? newBalance : maxBalance;
        setBalance(updatedBalance);
        const userId = localStorage.getItem('userId');
        try {
          await updateDoc(doc(db, 'users', userId), { balance: updatedBalance });
        } catch (err) {
          console.error('Error updating balance:', err);
        }
      }, 4 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [hasInvested, selectedInvestment, balance]);

  // Handle copy referral link
  const handleCopyLink = () => {
    if (user?.referralLink) {
      navigator.clipboard.writeText(user.referralLink);
      alert('Referral link copied to clipboard!');
    } else {
      alert('Referral link not available.');
    }
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
      url: user?.referralLink || 'https://payoneerinvestment.vercel.app/',
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
    localStorage.removeItem('userId');
    navigate('/signin', { replace: true });
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                <IconButton sx={{ color: '#FE4600', p: 1 }} onClick={handleWithdraw}>
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
                <IconButton sx={{ color: '#2FDB6D', p: 1 }} onClick={() => navigate('/assets')}>
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
                <IconButton sx={{ color: '#2087EC', p: 1 }} onClick={() => navigate('/invest')}>
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
                {user.referralLink || 'https://payoneerinvestment.vercel.app'}
              </Typography>
              <IconButton
                onClick={handleCopyLink}
                aria-label="Copy app link"
                sx={{ color: '#2087EC' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>

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
              Deposit Funds
            </Typography>
            <IconButton onClick={() => setOpenTopUpModal(false)} aria-label="Close modal">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="top-up-modal-description" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Phone Number (07XXXXXXXX or 254XXXXXXXXX)"
              value={depositData.phoneNumber}
              onChange={(e) => setDepositData({ ...depositData, phoneNumber: e.target.value })}
              disabled={depositLoading}
              error={!!topUpError}
              helperText={topUpError}
            />
            <TextField
              fullWidth
              label="Deposit Amount (KES)"
              value={depositData.amount}
              onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              disabled={depositLoading}
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
              aria-label="Cancel deposit"
              disabled={depositLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmTopUp}
              startIcon={depositLoading ? <CircularProgress size={20} /> : null}
              disabled={depositLoading}
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
              aria-label="Confirm deposit"
            >
              {depositLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openWithdrawModal}
        onClose={() => setOpenWithdrawModal(false)}
        aria-labelledby="withdraw-modal-title"
        aria-describedby="withdraw-modal-description"
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
              id="withdraw-modal-title"
              variant="h6"
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Withdraw Funds
            </Typography>
            <IconButton onClick={() => setOpenWithdrawModal(false)} aria-label="Close modal">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box id="withdraw-modal-description" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Phone Number (07XXXXXXXX or 254XXXXXXXXX)"
              value={withdrawData.phoneNumber}
              onChange={(e) => setWithdrawData({ ...withdrawData, phoneNumber: e.target.value })}
              disabled={withdrawLoading}
              error={!!withdrawError}
              helperText={withdrawError}
            />
            <TextField
              fullWidth
              label="Withdrawal Amount (KES)"
              value={withdrawData.amount}
              onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              disabled={withdrawLoading}
              error={!!withdrawError}
              helperText={withdrawError}
            />
            {withdrawSuccess && (
              <Typography
                sx={{
                  mt: 2,
                  color: '#2FDB6D',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                {withdrawSuccess}
              </Typography>
            )}
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={() => setOpenWithdrawModal(false)}
              sx={{
                color: '#666',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              aria-label="Cancel withdrawal"
              disabled={withdrawLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmWithdraw}
              startIcon={withdrawLoading ? <CircularProgress size={20} /> : null}
              disabled={withdrawLoading}
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
              aria-label="Confirm withdrawal"
            >
              {withdrawLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Modal>

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