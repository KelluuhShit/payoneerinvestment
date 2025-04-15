import { Card, CardContent, Skeleton } from '@mui/material';

const SkeletonCard = () => {
  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="circular" width={50} height={50} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;