import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const InvestmentCard = ({ title, amount, icon, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          background: gradient,
          color: '#fff',
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{amount}</Typography>
          <Box component="img" src={icon} alt={title} sx={{ width: 50, mt: 2 }} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvestmentCard;