import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  ContentCopy,
  Download,
  Logout,
  Person,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { db, doc, getDoc } from '../service/firebase';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [openReferralModal, setOpenReferralModal] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user data and validate authentication
  useEffect(() => {
    const fetchUserData = async () => {
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
          name: userData.name || 'Unknown User',
          email: userData.email || 'No email provided',
          referralCode: userData.referralCode || 'REF000',
          referralLink:
            userData.referralLink ||
            `https://app.example.com/ref/${userData.referralCode || 'REF000'}`,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
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
  const handleCopyLink = () => {
    if (user?.referralLink) {
      navigator.clipboard.writeText(user.referralLink);
      setOpenReferralModal(true);
    } else {
      alert('Referral link not available.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/signin', { replace: true });
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
      // Show modal for non-PWA-supporting browsers
      setOpenDownloadModal(true);
    }
  };

  const SkeletonProfile = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={60} height={60} />
        <Box sx={{ ml: 2 }}>
          <Skeleton variant="text" width={150} sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }} />
        </Box>
      </Box>
      {Array.from({ length: 3 }).map((_, index) => (
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
              }}
            >
              {user.email}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 8,
              borderColor: '#2087EC',
              color: '#2087EC',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              '&:hover': {
                background: '#2087EC',
                color: '#fff',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            aria-label="Edit profile"
          >
            Edit Profile
          </Button>
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
              mb: 2,
            }}
          >
            Install the app directly from your browser for a seamless experience.
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
              width: { xs: '90%', sm: 400 },
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
              }}
            >
              Your referral link has been copied to the clipboard. Share it with friends to earn 50% cashback on their first deposit!
            </Typography>
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
              }}
            >
              To install the app, please use a PWA-compatible browser like Chrome or Safari on a mobile device and select "Add to Home Screen" from the browser menu.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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