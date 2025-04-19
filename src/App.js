import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import Home from './pages/Home';
import Invest from './pages/Invest';
import Assets from './pages/Assets';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNavigationBar from './components/BottomNavigation';
import theme from './theme';

function App() {
  const location = useLocation();
  const publicRoutes = ['/', '/signup', '/signin'];
  const showBottomNav = !publicRoutes.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ pb: showBottomNav ? 8 : 0 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invest"
            element={
              <ProtectedRoute>
                <Invest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        {showBottomNav && <BottomNavigationBar />}
      </Box>
    </ThemeProvider>
  );
}

export default App;