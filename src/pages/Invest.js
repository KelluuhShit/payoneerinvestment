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
  TextField,
  CircularProgress,
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
import { toast } from 'react-toastify';
import { db } from '../service/firebase'; // Adjust path to your firebase config
import { doc, getDoc, updateDoc, addDoc, collection, runTransaction, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://payoneerinvestment.vercel.app/' : 'http://localhost:3000';

const Invest = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.00);
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [openInvestModal, setOpenInvestModal] = useState(null);
  const [openDepositModal, setOpenDepositModal] = useState(null);
  const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
  const [investmentsMade, setInvestmentsMade] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [depositData, setDepositData] = useState({ phoneNumber: '', amount: '' });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [depositError, setDepositError] = useState('');
  const navigate = useNavigate();

  // Fetch user data from Firestore
  useEffect(() => {
    const checkUser = async () => {
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
          uid: userId,
          name: userData.name || 'Unknown User',
          email: userData.email || 'No email provided',
        });
        setBalance(userData.balance || 0.00);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('userId');
        navigate('/signin', { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

  // Investment data
  const investments = useMemo(
    () => [
      {
        name: 'Bitmain Antminer S21 Hyd',
        activeInvestors: 5000,
        image: 'https://asic-miner-profitability.com/profit/images/miners/webp/bitmain_antminer_s19_hydrodesign_image3.webp',
        investmentPeriod: 7,
        investmentAmount: 500,
        dailyIncome: 500 * 0.1,
        totalIncome: 500 * 0.1 * 7,
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
        dailyIncome: 1000 * 0.1,
        totalIncome: 1000 * 0.1 * 7,
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
        dailyIncome: 1500 * 0.1,
        totalIncome: 1500 * 0.1 * 7,
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
        dailyIncome: 2000 * 0.1,
        totalIncome: 2000 * 0.1 * 7,
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
        dailyIncome: 2500 * 0.1,
        totalIncome: 2500 * 0.1 * 7,
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
        dailyIncome: 3000 * 0.1,
        totalIncome: 3000 * 0.1 * 7,
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
        dailyIncome: 3500 * 0.1,
        totalIncome: 3500 * 0.1 * 7,
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
        dailyIncome: 4000 * 0.1,
        totalIncome: 4000 * 0.1 * 7,
        isPopular: true,
        isNew: true,
        isHot: true,
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

  // Handle clicking "Invest Now"
  const handleInvestClick = (item) => {
    if (!user) {
      toast.error('Please sign in to invest.');
      navigate('/signin', { replace: true });
      return;
    }
    if (balance >= item.investmentAmount) {
      setOpenInvestModal(item);
    } else {
      setOpenDepositModal(item);
      toast.info('Insufficient balance. Please deposit funds to invest.');
    }
  };

  // Handle investment with PayHero STK Push
  const handleInvest = async (item) => {
    if (!phoneNumber || !/^(?:254|0)7\d{8}$/.test(phoneNumber)) {
      setPaymentError('Please enter a valid phone number (254XXXXXXXXX or 07XXXXXXXX).');
      return;
    }
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const reference = `INV-${Date.now()}-${user.uid}`;
      const response = await axios.post(`${API_BASE_URL}/api/payhero-stk-push`, {
        phoneNumber,
        amount: item.investmentAmount,
        reference,
      });
      console.log('STK Push response:', response.data);
      if (response.data.success) {
        console.log('Triggering STK toast for:', phoneNumber);
        toast.success(`STK initiated successfully on ${phoneNumber}`, {
          onOpen: () => console.log('STK toast should be visible'),
          onClose: () => console.log('STK toast closed'),
        });
        const payheroReference = response.data.payheroReference || '';
        const checkoutRequestID = response.data.CheckoutRequestID || null;
        if (!payheroReference) {
          console.warn('PayHero response missing payheroReference');
        }
        if (!checkoutRequestID) {
          console.warn('PayHero response missing CheckoutRequestID');
        }
        const investmentRef = await addDoc(
          collection(db, `users/${user.uid}/investments`),
          {
            name: item.name,
            amount: item.investmentAmount,
            period: item.investmentPeriod,
            dailyIncome: item.dailyIncome,
            totalIncome: item.totalIncome,
            status: 'QUEUED',
            reference,
            payheroReference,
            checkoutRequestID,
            createdAt: serverTimestamp(),
          }
        );
        setInvestmentsMade((prev) => [...prev, { ...item, id: investmentRef.id, status: 'QUEUED' }]);
        let attempts = 0;
        const interval = setInterval(async () => {
          if (attempts === 0) {
            console.log('Delaying first poll by 10 seconds');
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
          attempts++;
          try {
            const statusReference = payheroReference || checkoutRequestID || reference;
            console.log(`Polling with reference: ${statusReference}`);
            const statusResponse = await axios.get(
              `${API_BASE_URL}/api/transaction-status?reference=${statusReference}`
            );
            const { status } = statusResponse.data;
            console.log(`Investment status [attempt ${attempts}]:`, status);
            await updateDoc(doc(db, `users/${user.uid}/investments`, investmentRef.id), { status });
            if (status === 'SUCCESS') {
              await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await transaction.get(userRef);
                const newBalance = (userDoc.data().balance || 0) - item.investmentAmount;
                transaction.update(userRef, { balance: newBalance });
                transaction.update(doc(db, `users/${user.uid}/investments`, investmentRef.id), { status });
              });
              setBalance((prev) => prev - item.investmentAmount);
              toast.success(`Investment of KES ${item.investmentAmount.toFixed(2)} in ${item.name} confirmed!`, {
                onOpen: () => console.log('Investment success toast should be visible'),
                onClose: () => console.log('Investment success toast closed'),
              });
              clearInterval(interval);
              setOpenInvestModal(null);
              setPhoneNumber('');
            } else if (status === 'FAILED' || status === 'CANCELLED' || attempts >= 30) {
              setPaymentError(`Investment ${status.toLowerCase()}.`);
              toast.error(`Investment ${status.toLowerCase()}.`);
              clearInterval(interval);
              setOpenInvestModal(null);
              setPhoneNumber('');
            }
          } catch (err) {
            console.error('Status poll error:', err);
            console.log('Status poll error details:', {
              message: err.message,
              status: err.response?.status,
              data: err.response?.data,
            });
            if (attempts >= 30) {
              setPaymentError('Investment timed out. Please check your investment history.');
              toast.error('Investment timed out. Please check your investment history.');
              clearInterval(interval);
              setOpenInvestModal(null);
              setPhoneNumber('');
            }
          }
        }, 5000);
      } else {
        const errorMsg = response.data.error || response.data.data?.error_message || 'Failed to initiate investment.';
        setPaymentError(errorMsg);
        toast.error(errorMsg);
        console.log('STK Push failed:', response.data);
      }
    } catch (err) {
      console.error('Investment error:', err);
      const errorMessage =
        err.message === 'Missing or insufficient permissions.'
          ? 'Permission denied. Please contact support.'
          : err.response?.data?.error ||
            err.response?.data?.data?.error_message ||
            err.message ||
            'Failed to process investment. Please try again.';
      setPaymentError(errorMessage);
      toast.error(errorMessage);
      console.log('Set paymentError:', errorMessage);
      console.log('Error response:', err.response?.data);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle deposit with PayHero STK Push
  const handleConfirmDeposit = async (item) => {
    if (!depositData.phoneNumber || !depositData.amount) {
      setDepositError('Please enter phone number and amount.');
      toast.error('Please enter phone number and amount.');
      return;
    }
    const phoneRegex = /^(?:254|0)7\d{8}$/;
    if (!phoneRegex.test(depositData.phoneNumber)) {
      setDepositError('Phone number must be 254XXXXXXXXX or 07XXXXXXXX');
      toast.error('Phone number must be 254XXXXXXXXX or 07XXXXXXXX');
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
      const reference = `DEP-${Date.now()}-${user.uid}`;
      const response = await axios.post(`${API_BASE_URL}/api/payhero-stk-push`, {
        phoneNumber: depositData.phoneNumber,
        amount,
        reference,
      });
      console.log('Deposit STK Push response:', response.data);
      if (response.data.success) {
        console.log('Triggering deposit STK toast for:', depositData.phoneNumber);
        toast.success(`STK initiated successfully on ${depositData.phoneNumber}`, {
          onOpen: () => console.log('Deposit STK toast should be visible'),
          onClose: () => console.log('Deposit STK toast closed'),
        });
        const payheroReference = response.data.payheroReference || '';
        const checkoutRequestID = response.data.CheckoutRequestID || null;
        if (!payheroReference) {
          console.warn('PayHero response missing payheroReference');
        }
        if (!checkoutRequestID) {
          console.warn('PayHero response missing CheckoutRequestID');
        }
        const txRef = await addDoc(collection(db, `users/${user.uid}/transactions`), {
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
            console.log('Delaying first deposit poll by 10 seconds');
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
          attempts++;
          try {
            const statusReference = payheroReference || checkoutRequestID || reference;
            console.log(`Polling deposit with reference: ${statusReference}`);
            const statusResponse = await axios.get(`${API_BASE_URL}/api/transaction-status?reference=${statusReference}`);
            const { status } = statusResponse.data;
            console.log(`Deposit status [attempt ${attempts}]:`, status);
            await updateDoc(doc(db, `users/${user.uid}/transactions`, txRef.id), { status });
            if (status === 'SUCCESS') {
              await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await transaction.get(userRef);
                const newBalance = (userDoc.data().balance || 0) + amount;
                transaction.update(userRef, { balance: newBalance });
                transaction.update(doc(db, `users/${user.uid}/transactions`, txRef.id), { status });
              });
              setBalance((prev) => prev + amount);
              toast.success(`Deposited KES ${amount.toFixed(2)} successfully.`, {
                onOpen: () => console.log('Deposit success toast should be visible'),
                onClose: () => console.log('Deposit success toast closed'),
              });
              clearInterval(interval);
              setDepositData({ phoneNumber: '', amount: '' });
              setOpenDepositModal(null);
              // Open investment modal if balance is now sufficient
              if (balance + amount >= item.investmentAmount) {
                setOpenInvestModal(item);
              } else {
                toast.info('Balance still insufficient. Deposit more funds.');
              }
            } else if (status === 'FAILED' || status === 'CANCELLED' || attempts >= 30) {
              setDepositError(`Deposit ${status.toLowerCase()}.`);
              toast.error(`Deposit ${status.toLowerCase()}.`);
              clearInterval(interval);
              setOpenDepositModal(null);
            }
          } catch (err) {
            console.error('Deposit status poll error:', err);
            console.log('Deposit status poll error details:', {
              message: err.message,
              status: err.response?.status,
              data: err.response?.data,
            });
            if (attempts >= 30) {
              setDepositError('Deposit timed out. Please check your transaction history.');
              toast.error('Deposit timed out. Please check your transaction history.');
              clearInterval(interval);
              setOpenDepositModal(null);
            }
          }
        }, 5000);
      } else {
        const errorMsg = response.data.error || response.data.data?.error_message || 'Failed to initiate deposit.';
        setDepositError(errorMsg);
        toast.error(errorMsg);
        console.log('Deposit STK Push failed:', response.data);
      }
    } catch (err) {
      console.error('Deposit error:', err);
      const errorMessage =
        err.message === 'Missing or insufficient permissions.'
          ? 'Permission denied. Please contact support.'
          : err.response?.data?.error ||
            err.response?.data?.data?.error_message ||
            err.message ||
            'Failed to process deposit. Please try again.';
      setDepositError(errorMessage);
      toast.error(errorMessage);
      console.log('Set depositError:', errorMessage);
      console.log('Error response:', err.response?.data);
    } finally {
      setDepositLoading(false);
    }
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

  const SkeletonModal = () => (
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
      <Skeleton variant="text" width="60%" sx={{ fontSize: '1.5rem', mb: 2 }} />
      <Skeleton variant="text" width="80%" sx={{ fontSize: '1rem', mb: 2 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={120} height={36} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 2, pb: 8 }}>
      {loading || !user ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
            <Button
              variant="outlined"
              onClick={() => setOpenCategoriesModal(true)}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 8,
                border: '1px solid #2087EC',
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
            >
              See All
            </Button>
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
                            onClick={() => handleInvestClick(item)}
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
                setPhoneNumber('');
                setPaymentError('');
              }}
              aria-labelledby="invest-modal-title"
              aria-describedby="invest-modal-description"
            >
              {loading ? (
                <SkeletonModal />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
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
                          setPhoneNumber('');
                          setPaymentError('');
                        }}
                        aria-label="Close modal"
                      >
                        <Close />
                      </IconButton>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          color: '#666',
                          fontWeight: 500,
                        }}
                      >
                        Current Balance: KES {balance.toFixed(2)}
                      </Typography>
                      <Typography
                        id="invest-modal-description"
                        variant="body2"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          color: '#666',
                        }}
                      >
                        Invest KES {openInvestModal.investmentAmount.toFixed(2)} for a {openInvestModal.investmentPeriod}-day period.
                      </Typography>
                      <TextField
                        fullWidth
                        label="Phone Number (07XXXXXXXX or 254XXXXXXXXX)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={paymentLoading}
                        error={!!paymentError}
                        helperText={paymentError}
                        inputProps={{ 'aria-label': 'Phone number for payment' }}
                      />
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        onClick={() => {
                          setOpenInvestModal(null);
                          setPhoneNumber('');
                          setPaymentError('');
                        }}
                        sx={{
                          color: '#666',
                          textTransform: 'none',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        disabled={paymentLoading}
                        aria-label="Cancel investment"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleInvest(openInvestModal)}
                        startIcon={paymentLoading ? <CircularProgress size={20} /> : null}
                        disabled={paymentLoading}
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
                        {paymentLoading ? 'Processing...' : 'Confirm'}
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </Modal>
          )}

          {/* Deposit Modal */}
          {openDepositModal && (
            <Modal
              open={!!openDepositModal}
              onClose={() => {
                setOpenDepositModal(null);
                setDepositData({ phoneNumber: '', amount: '' });
                setDepositError('');
              }}
              aria-labelledby="deposit-modal-title"
              aria-describedby="deposit-modal-description"
            >
              {loading ? (
                <SkeletonModal />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
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
                        id="deposit-modal-title"
                        variant="h6"
                        sx={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        Deposit Funds
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setOpenDepositModal(null);
                          setDepositData({ phoneNumber: '', amount: '' });
                          setDepositError('');
                        }}
                        aria-label="Close modal"
                      >
                        <Close />
                      </IconButton>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          color: '#666',
                          fontWeight: 500,
                        }}
                      >
                        Current Balance: KES {balance.toFixed(2)}
                      </Typography>
                      <Typography
                        id="deposit-modal-description"
                        variant="body2"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          color: '#666',
                        }}
                      >
                        You need at least KES {openDepositModal.investmentAmount.toFixed(2)} to invest in {openDepositModal.name}. Deposit a minimum of KES 500.
                      </Typography>
                      <TextField
                        fullWidth
                        label="Phone Number (07XXXXXXXX or 254XXXXXXXXX)"
                        value={depositData.phoneNumber}
                        onChange={(e) => setDepositData({ ...depositData, phoneNumber: e.target.value })}
                        disabled={depositLoading}
                        error={!!depositError}
                        helperText={depositError}
                      />
                      <TextField
                        fullWidth
                        label="Deposit Amount (KES, min 500)"
                        value={depositData.amount}
                        onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                        type="number"
                        inputProps={{ min: 500, step: '0.01' }}
                        disabled={depositLoading}
                        error={!!depositError}
                        helperText={depositError}
                      />
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        onClick={() => {
                          setOpenDepositModal(null);
                          setDepositData({ phoneNumber: '', amount: '' });
                          setDepositError('');
                        }}
                        sx={{
                          color: '#666',
                          textTransform: 'none',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        disabled={depositLoading}
                        aria-label="Cancel deposit"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleConfirmDeposit(openDepositModal)}
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
                </motion.div>
              )}
            </Modal>
          )}

          {/* Categories Modal */}
          <Modal
            open={openCategoriesModal}
            onClose={() => setOpenCategoriesModal(false)}
            aria-labelledby="categories-modal-title"
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
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                  id="categories-modal-title"
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  All Categories
                </Typography>
                <IconButton
                  onClick={() => setOpenCategoriesModal(false)}
                  aria-label="Close categories modal"
                >
                  <Close />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Popular', 'New', 'Hot'].map((filter, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => {
                      setActiveFilter(filter);
                      setOpenCategoriesModal(false);
                    }}
                    sx={{
                      textTransform: 'none',
                      fontFamily: 'Inter, sans-serif',
                      color: '#2087EC',
                      borderColor: '#2087EC',
                      '&:hover': {
                        background: '#e8f0fe',
                        borderColor: '#1a6dc3',
                      },
                    }}
                  >
                    {filter}
                  </Button>
                ))}
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default Invest;