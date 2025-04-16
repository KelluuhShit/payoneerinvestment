import { Card, CardContent, Typography, Box } from '@mui/material';

const InvestmentCard = ({ title, amount, icon, gradient, textColor }) => {
  return (
    <Card sx={{ 
      mb: 2, 
      background: gradient,
      borderRadius: 2,
      boxShadow: 2,
    }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 2 }}>
          <img src={icon} alt={title} width="40" height="40" />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: textColor,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: textColor,
              fontFamily: 'Roboto Mono, sans-serif'
            }}
          >
            {amount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvestmentCard;