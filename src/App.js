import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;