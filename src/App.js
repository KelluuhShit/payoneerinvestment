import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import Home from './pages/Home';
import Invest from './pages/Invest';
import Assets from './pages/Assets';
import Profile from './pages/Profile';
import BottomNavigationBar from './components/BottomNavigation';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ pb: 8 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNavigationBar />
      </Box>
    </ThemeProvider>
  );
}

export default App;