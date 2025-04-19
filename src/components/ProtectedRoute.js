import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  return auth.currentUser ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;