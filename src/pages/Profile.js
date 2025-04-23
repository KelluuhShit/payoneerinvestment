import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Modal,
  IconButton,
  Skeleton,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  ContentCopy,
  Download,
  Logout,
  Person,
  Close,
  Send,
  ArrowUpward,
  ArrowDownward,
  Edit,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { db } from '../service/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  runTransaction,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://payoneerinvestment.vercel.app/' : 'http://localhost:3000';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [openReferralModal, setOpenReferralModal] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [depositData, setDepositData] = useState({ phoneNumber: '', amount: '' });
  const [withdrawalData, setWithdrawalData] = useState({ phoneNumber: '', amount: '' });
  const [transactions, setTransactions] = useState([]);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  // Changed: Separate error states for each modal
  const [editError, setEditError] = useState('');
  const [depositError, setDepositError] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');
  const navigate = useNavigate();

  // Fetch user data and transactions
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please sign in.');
        navigate('/signin', { replace: true });
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
          localStorage.removeItem('userId');
          toast.error('User not found.');
          navigate('/signin', { replace: true });
          return;
        }
        const userData = userDoc.data();
        let referralCode = userData.referralCode;
        if (!referralCode) {
          referralCode = `REF${uuidv4().slice(0, 6).toUpperCase()}`;
          await updateDoc(doc(db, 'users', userId), { referralCode });
        }
        const referralLink = `https://app.example.com/ref/${referralCode}`;
        setUser({
          id: userId,
          name: userData.name || 'Unknown User',
          email: userData.email || 'No email provided',
          balance: userData.balance || 0.00,
          referralCode,
          referralLink,
        });
        setEditData({
          name: userData.name || 'Unknown User',
          email: userData.email || 'No email provided',
        });

        // Fetch transactions from subcollections
        const txSnapshot = await getDocs(collection(db, `users/${userId}/transactions`));
        const investSnapshot = await getDocs(collection(db, `users/${userId}/investments`));
        const txData = txSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        const investData = investSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          type: 'investment',
        }));
        const allTransactions = [...txData, ...investData].sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setTransactions(allTransactions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Failed to load profile.');
        localStorage.removeItem('userId');
        navigate('/signin', { replace: true });
      }
    };
    fetchUserData();
  }, [navigate]);

  // Capture beforeinstallprompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Handle copy referral link
  const handleCopyLink = async () => {
    if (user?.referralLink) {
      try {
        await navigator.clipboard.writeText(user.referralLink);
        toast.success('Referral link copied!');
        setOpenReferralModal(true);
      } catch (err) {
        toast.error('Failed to copy link.');
      }
    } else {
      toast.error('Referral link not available.');
    }
  };

  // Handle edit profile
  const handleEditProfile = async () => {
    if (!editData.name || !editData.email) {
      setEditError('Please enter name and email.');
      toast.error('Please enter name and email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setEditError('Please enter a valid email.');
      toast.error('Please enter a valid email.');
      return;
    }
    setEditLoading(true);
    setEditError('');
    try {
      await updateDoc(doc(db, 'users', user.id), {
        name: editData.name,
        email: editData.email,
      });
      setUser((prev) => ({ ...prev, name: editData.name, email: editData.email }));
      toast.success('Profile updated successfully!');
      setOpenEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setEditError('Failed to update profile.');
      toast.error('Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    toast.success('Logged out successfully.');
    navigate('/signin', { replace: true });
  };

  // Handle PWA installation
  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('App installed successfully!');
        setInstallPrompt(null);
      } else {
        toast.info('App installation cancelled.');
      }
    } else {
      setOpenDownloadModal(true);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    if (!depositData.phoneNumber || !depositData.amount) {
      setDepositError('Please enter phone number and amount.');
      toast.error('Please enter phone number and amount.');
      return;
    }
    const phoneRegex = /^(?:254|0)7\d{8}$/;
    if (!phoneRegex.test(depositData.phoneNumber)) {
      setDepositError('Phone number must be 254XXXXXXXXX or 07XXXXXXXX.');
      toast.error('Phone number must be 254XXXXXXXXX or 07XXXXXXXX.');
      return;
    }
    const amount = Number(depositData.amount);
    if (isNaN(amount) || amount < 500) {
      setDepositError('Amount must be at least KES 500.');
      toast.error('Amount must be at least KES 500.');
      return;
    }
    setDepositLoading(true);
    setDepositError('');
    try {
      const reference = `DEP-${Date.now()}-${user.id}`;
      const response = await axios.post(`${API_BASE_URL}/api/payhero-stk-push`, {
        phoneNumber: depositData.phoneNumber,
        amount,
        reference,
      });
      console.log('Deposit STK Push response:', response.data);
      if (response.data.success) {
        toast.success(`STK initiated on ${depositData.phoneNumber}`);
        const payheroReference = response.data.payheroReference || '';
        const checkoutRequestID = response.data.CheckoutRequestID || null;
        const txRef = await addDoc(collection(db, `users/${user.id}/transactions`), {
          type: 'deposit',
          amount,
          status: 'QUEUED',
          reference,
          payheroReference,
          checkoutRequestID,
          createdAt: serverTimestamp(),
        });
        let attempts = 0;
        const interval = setInterval(async () => {
          if (attempts === 0) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
          attempts++;
          try {
            const statusReference = payheroReference || checkoutRequestID || reference;
            const statusResponse = await axios.get(
              `${API_BASE_URL}/api/transaction-status?reference=${statusReference}`
            );
            const { status } = statusResponse.data;
            console.log(`Deposit status [attempt ${attempts}]:`, status);
            await updateDoc(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
            if (status === 'SUCCESS') {
              await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.id);
                const userDoc = await transaction.get(userRef);
                const newBalance = (userDoc.data().balance || 0) + amount;
                transaction.update(userRef, { balance: newBalance });
                transaction.update(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
              });
              setUser((prev) => ({ ...prev, balance: prev.balance + amount }));
              setTransactions((prev) => [
                ...prev,
                {
                  id: txRef.id,
                  type: 'deposit',
                  amount,
                  status,
                  reference,
                  createdAt: new Date(),
                },
              ].sort((a, b) => b.createdAt - a.createdAt));
              toast.success(`Deposited KES ${amount.toFixed(2)} successfully!`);
              clearInterval(interval);
              setDepositData({ phoneNumber: '', amount: '' });
            } else if (status === 'FAILED' || status === 'CANCELLED' || attempts >= 30) {
              setDepositError(`Deposit ${status.toLowerCase()}.`);
              toast.error(`Deposit ${status.toLowerCase()}.`);
              clearInterval(interval);
            }
          } catch (err) {
            console.error('Deposit status poll error:', err);
            if (attempts >= 30) {
              setDepositError('Deposit timed out.');
              toast.error('Deposit timed out.');
              clearInterval(interval);
            }
          }
        }, 5000);
      } else {
        const errorMsg = response.data.error || 'Failed to initiate deposit.';
        setDepositError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Deposit error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to process deposit.';
      setDepositError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setDepositLoading(false);
    }
  };

  // Handle withdrawal
  const handleWithdrawal = async () => {
    if (!withdrawalData.phoneNumber || !withdrawalData.amount) {
      setWithdrawalError('Please enter phone number and amount.');
      toast.error('Please enter phone number and amount.');
      return;
    }
    const phoneRegex = /^(?:254|0)7\d{8}$/;
    if (!phoneRegex.test(withdrawalData.phoneNumber)) {
      setWithdrawalError('Phone number must be 254XXXXXXXXX or 07XXXXXXXX.');
      toast.error('Phone number must be 254XXXXXXXXX or 07XXXXXXXX.');
      return;
    }
    const amount = Number(withdrawalData.amount);
    if (isNaN(amount) || amount < 500) {
      setWithdrawalError('Amount must be at least KES 500.');
      toast.error('Amount must be at least KES 500.');
      return;
    }
    if (amount > user.balance) {
      setWithdrawalError('Insufficient balance.');
      toast.error('Insufficient balance.');
      return;
    }
    setWithdrawalLoading(true);
    setWithdrawalError('');
    try {
      const reference = `WDR-${Date.now()}-${user.id}`;
      const response = await axios.post(`${API_BASE_URL}/api/payhero-payout`, {
        phoneNumber: withdrawalData.phoneNumber,
        amount,
        reference,
        userId: user.id,
      });
      console.log('Withdrawal response:', response.data);
      if (response.data.success) {
        toast.success(`Withdrawal initiated to ${withdrawalData.phoneNumber}`);
        const payheroReference = response.data.payheroReference || '';
        const checkoutRequestID = response.data.CheckoutRequestID || null;
        const txRef = await addDoc(collection(db, `users/${user.id}/transactions`), {
          type: 'withdrawal',
          amount,
          status: 'QUEUED',
          reference,
          payheroReference,
          checkoutRequestID,
          createdAt: serverTimestamp(),
        });
        let attempts = 0;
        const interval = setInterval(async () => {
          if (attempts === 0) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
          attempts++;
          try {
            const statusReference = payheroReference || checkoutRequestID || reference;
            const statusResponse = await axios.get(
              `${API_BASE_URL}/api/transaction-status?reference=${statusReference}`
            );
            const { status } = statusResponse.data;
            console.log(`Withdrawal status [attempt ${attempts}]:`, status);
            await updateDoc(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
            if (status === 'SUCCESS') {
              await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.id);
                const userDoc = await transaction.get(userRef);
                const newBalance = (userDoc.data().balance || 0) - amount;
                transaction.update(userRef, { balance: newBalance });
                transaction.update(doc(db, `users/${user.id}/transactions`, txRef.id), { status });
              });
              setUser((prev) => ({ ...prev, balance: prev.balance - amount }));
              setTransactions((prev) => [
                ...prev,
                {
                  id: txRef.id,
                  type: 'withdrawal',
                  amount,
                  status,
                  reference,
                  createdAt: new Date(),
                },
              ].sort((a, b) => b.createdAt - a.createdAt));
              toast.success(`Withdrawn KES ${amount.toFixed(2)} successfully!`);
              clearInterval(interval);
              setWithdrawalData({ phoneNumber: '', amount: '' });
            } else if (status === 'FAILED' || status == 'CANCELLED' || attempts >= 30) {
              setWithdrawalError(`Withdrawal ${status.toLowerCase()}.`);
              toast.error(`Withdrawal ${status.toLowerCase()}.`);
              clearInterval(interval);
            }
          } catch (err) {
            console.error('Withdrawal status poll error:', err);
            if (attempts >= 30) {
              setWithdrawalError('Withdrawal timed out.');
              toast.error('Withdrawal timed out.');
              clearInterval(interval);
            }
          }
        }, 5000);
      } else {
        const errorMsg = response.data.error || 'Failed to initiate withdrawal.';
        setWithdrawalError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to process withdrawal.';
      setWithdrawalError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // Memoized skeleton
  const SkeletonProfile = () => (
    <Box sx={{ mb: 3, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={60} height={60} />
        <Box sx={{ ml: 2 }}>
          <Skeleton variant="text" width={150} sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }} />
        </Box>
      </Box>
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 3 }} />
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
    </Box>
  );

  if (loading || !user) {
    return <Box sx={{ p: 2, pb: 8 }}><SkeletonProfile /></Box>;
  }

  return (
    <Box sx={{ p: 2, pb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            mb: 2,
            ml: 3,
            mr: 3,
          }}
        >
          Profile
        </Typography>

        {/* Profile Header */}
        <Card
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
              boxShadow: 4,
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
          role="article"
          aria-label={`Profile for ${user.name}`}
        >
          <Avatar
            sx={{ width: 60, height: 60, bgcolor: '#2087EC' }}
            aria-label="User avatar"
          >
            <Person />
          </Avatar>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#000',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
              }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              {user.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Balance: KES {user.balance.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setOpenEditModal(true)}
            startIcon={<Edit />}
            sx={{
              borderRadius: 8,
              borderColor: '#2087EC',
              color: '#2087EC',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              '&:hover': {
                background: '#e8f0fe',
                borderColor: '#1a6dc3',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            aria-label="Edit profile"
          >
            Edit Profile
          </Button>
        </Card>

        {/* Deposit */}
        <Card
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            p: 2,
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
              boxShadow: 4,
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
          role="article"
          aria-label="Deposit funds"
        >
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Deposit Funds
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              mb: 2,
            }}
          >
            Deposit at least KES 500 via M-PESA to start mining with 10% daily interest.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Phone Number (07XXXXXXXX or 254XXXXXXXXX)"
              value={depositData.phoneNumber}
              onChange={(e) => {
                setDepositData({ ...depositData, phoneNumber: e.target.value });
                setDepositError(''); // Clear error on input change
              }}
              fullWidth
              size="small"
              disabled={depositLoading}
              error={!!depositError && depositError.includes('Phone number')}
              helperText={depositError && depositError.includes('Phone number') ? depositError : ''}
            />
            <TextField
              label="Amount (KES, min 500)"
              type="number"
              value={depositData.amount}
              onChange={(e) => {
                setDepositData({ ...depositData, amount: e.target.value });
                setDepositError(''); // Clear error on input change
              }}
              fullWidth
              size="small"
              inputProps={{ min: 500, step: '0.01' }}
              disabled={depositLoading}
              error={!!depositError && depositError.includes('Amount')}
              helperText={depositError && depositError.includes('Amount') ? depositError : ''}
            />
            {depositError && !depositError.includes('Phone number') && !depositError.includes('Amount') && (
              <Typography color="error" variant="body2">
                {depositError}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleDeposit}
              startIcon={depositLoading ? <CircularProgress size={20} /> : <ArrowUpward />}
              disabled={depositLoading}
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
              aria-label="Deposit funds"
            >
              {depositLoading ? 'Processing...' : 'Deposit'}
            </Button>
          </Box>
        </Card>

        {/* Withdrawal */}
        <Card
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            p: 2,
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
              boxShadow: 4,
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
          role="article"
          aria-label="Withdraw funds"
        >
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Withdraw Funds
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              mb: 2,
            }}
          >
            Withdraw at least KES 500 to your M-PESA account.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Phone Number (07XXXXXXXX or 254XXXXXXXXX)"
              value={withdrawalData.phoneNumber}
              onChange={(e) => {
                setWithdrawalData({ ...withdrawalData, phoneNumber: e.target.value });
                setWithdrawalError(''); // Clear error on input change
              }}
              fullWidth
              size="small"
              disabled={withdrawalLoading}
              error={!!withdrawalError && withdrawalError.includes('Phone number')}
              helperText={withdrawalError && withdrawalError.includes('Phone number') ? withdrawalError : ''}
            />
            <TextField
              label="Amount (KES, min 500)"
              type="number"
              value={withdrawalData.amount}
              onChange={(e) => {
                setWithdrawalData({ ...withdrawalData, amount: e.target.value });
                setWithdrawalError(''); // Clear error on input change
              }}
              fullWidth
              size="small"
              inputProps={{ min: 500, step: '0.01' }}
              disabled={withdrawalLoading}
              error={!!withdrawalError && (withdrawalError.includes('Amount') || withdrawalError.includes('Insufficient'))}
              helperText={withdrawalError && (withdrawalError.includes('Amount') || withdrawalError.includes('Insufficient')) ? withdrawalError : ''}
            />
            {withdrawalError && !withdrawalError.includes('Phone number') && !withdrawalError.includes('Amount') && !withdrawalError.includes('Insufficient') && (
              <Typography color="error" variant="body2">
                {withdrawalError}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleWithdrawal}
              startIcon={withdrawalLoading ? <CircularProgress size={20} /> : <ArrowDownward />}
              disabled={withdrawalLoading}
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
              aria-label="Withdraw funds"
            >
              {withdrawalLoading ? 'Processing...' : 'Withdraw'}
            </Button>
          </Box>
        </Card>

        {/* Transaction History */}
        <Card
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            p: 2,
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
              boxShadow: 4,
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
          role="article"
          aria-label="Transaction history"
        >
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Transaction History
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              mb: 2,
            }}
          >
            View your recent deposits, withdrawals, and investments.
          </Typography>
          <List sx={{ maxHeight: 200, overflow: 'auto' }}>
            {transactions.length === 0 ? (
              <ListItem>
                <ListItemText primary="No transactions yet." />
              </ListItem>
            ) : (
              transactions.map((tx) => (
                <ListItem key={tx.id}>
                  <ListItemText
                    primary={
                      tx.type === 'deposit'
                        ? `Deposit: KES ${tx.amount.toFixed(2)}`
                        : tx.type === 'withdrawal'
                        ? `Withdrawal: KES ${tx.amount.toFixed(2)}`
                        : `Investment: KES ${tx.amount.toFixed(2)} (${tx.name})`
                    }
                    secondary={`${tx.status} - ${tx.createdAt.toLocaleString()}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Card>

        {/* Referrals */}
        <Card
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            p: 2,
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
              boxShadow: 4,
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
          role="article"
          aria-label="Referrals and earn 50% cashback deposit"
        >
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Referrals & Earn 50% Cashback
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              mb: 2,
            }}
          >
            Invite friends with your referral code and earn 50% cashback on their first deposit.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#2087EC',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Code: {user.referralCode}
            </Typography>
            <IconButton
              onClick={handleCopyLink}
              aria-label="Copy referral link"
              sx={{
                color: '#2087EC',
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <ContentCopy />
            </IconButton>
          </Box>
        </Card>

        {/* Install App */}
        <Card
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            p: 2,
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
              boxShadow: 4,
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
          role="article"
          aria-label="Install app"
        >
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Install App
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              mb: 2,
            }}
          >
            Install the app for a seamless experience.
          </Typography>
          <Button
            variant="contained"
            onClick={handleInstall}
            startIcon={<Download />}
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
            aria-label="Install app"
          >
            Install Now
          </Button>
        </Card>

        {/* Log Out */}
        <Card
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(180deg, #ffffff, #e8f0fe)',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            p: 2,
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(180deg, #f5f5f5, #ffffff)',
              boxShadow: 4,
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
          role="article"
          aria-label="Log out"
        >
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Log Out
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              mb: 2,
            }}
          >
            Sign out of your account.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenLogoutModal(true)}
            startIcon={<Logout />}
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
            aria-label="Log out"
          >
            Log Out
          </Button>
        </Card>

        {/* Edit Profile Modal */}
        <Modal
          open={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setEditError('');
            setEditData({ name: user.name, email: user.email });
          }}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
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
                id="edit-modal-title"
                variant="h6"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                }}
              >
                Edit Profile
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenEditModal(false);
                  setEditError('');
                  setEditData({ name: user.name, email: user.email });
                }}
                aria-label="Close modal"
              >
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                value={editData.name}
                onChange={(e) => {
                  setEditData({ ...editData, name: e.target.value });
                  setEditError(''); // Clear error on input change
                }}
                fullWidth
                size="small"
                disabled={editLoading}
                error={!!editError && editError.includes('name')}
                helperText={editError && editError.includes('name') ? editError : ''}
              />
              <TextField
                label="Email"
                value={editData.email}
                onChange={(e) => {
                  setEditData({ ...editData, email: e.target.value });
                  setEditError(''); // Clear error on input change
                }}
                fullWidth
                size="small"
                disabled={editLoading}
                error={!!editError && editError.includes('email')}
                helperText={editError && editError.includes('email') ? editError : ''}
              />
              {editError && !editError.includes('name') && !editError.includes('email') && (
                <Typography color="error" variant="body2">
                  {editError}
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={() => {
                  setOpenEditModal(false);
                  setEditError('');
                  setEditData({ name: user.name, email: user.email });
                }}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
                disabled={editLoading}
                aria-label="Cancel edit"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleEditProfile}
                startIcon={editLoading ? <CircularProgress size={20} /> : null}
                disabled={editLoading}
                sx={{
                  background: '#2087EC',
                  color: '#fff',
                  borderRadius: 8,
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  '&:hover': {
                    background: '#1a6dc3',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                aria-label="Save profile changes"
              >
                {editLoading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Referral Modal */}
        <Modal
          open={openReferralModal}
          onClose={() => setOpenReferralModal(false)}
          aria-labelledby="referral-modal-title"
          aria-describedby="referral-modal-description"
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
                id="referral-modal-title"
                variant="h6"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                }}
              >
                Referral Link Copied
              </Typography>
              <IconButton
                onClick={() => setOpenReferralModal(false)}
                aria-label="Close modal"
              >
                <Close />
              </IconButton>
            </Box>
            <Typography
              id="referral-modal-description"
              variant="body2"
              sx={{
                mt: 2,
                fontFamily: 'Inter, sans-serif',
                color: '#666',
                fontWeight: 500,
              }}
            >
              Your referral link has been copied to the clipboard. Share it with friends to earn 50% cashback on their first deposit!
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setOpenReferralModal(false)}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
                aria-label="Close modal"
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Logout Modal */}
        <Modal
          open={openLogoutModal}
          onClose={() => setOpenLogoutModal(false)}
          aria-labelledby="logout-modal-title"
          aria-describedby="logout-modal-description"
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
                id="logout-modal-title"
                variant="h6"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                }}
              >
                Confirm Logout
              </Typography>
              <IconButton
                onClick={() => setOpenLogoutModal(false)}
                aria-label="Close modal"
              >
                <Close />
              </IconButton>
            </Box>
            <Typography
              id="logout-modal-description"
              variant="body2"
              sx={{
                mt: 2,
                fontFamily: 'Inter, sans-serif',
                color: '#666',
                fontWeight: 500,
              }}
            >
              Are you sure you want to log out?
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={() => setOpenLogoutModal(false)}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
                aria-label="Cancel logout"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  background: '#2087EC',
                  color: '#fff',
                  borderRadius: 8,
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  '&:hover': {
                    background: '#1a6dc3',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                aria-label="Confirm logout"
              >
                Log Out
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Download Modal for Non-PWA Browsers */}
        <Modal
          open={openDownloadModal}
          onClose={() => setOpenDownloadModal(false)}
          aria-labelledby="download-modal-title"
          aria-describedby="download-modal-description"
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
                id="download-modal-title"
                variant="h6"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                }}
              >
                Install App
              </Typography>
              <IconButton
                onClick={() => setOpenDownloadModal(false)}
                aria-label="Close modal"
              >
                <Close />
              </IconButton>
            </Box>
            <Typography
              id="download-modal-description"
              variant="body2"
              sx={{
                mt: 2,
                fontFamily: 'Inter, sans-serif',
                color: '#666',
                fontWeight: 500,
              }}
            >
              To install the app, use a PWA-compatible browser like Chrome or Safari on a mobile device and select "Add to Home Screen" from the browser menu.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setOpenDownloadModal(false)}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
                aria-label="Close modal"
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </motion.div>
    </Box>
  );
};

export default Profile;