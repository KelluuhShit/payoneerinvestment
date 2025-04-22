import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../service/firebase';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        setIsAuthenticated(userDoc.exists());
      } catch (err) {
        console.error('Error validating user:', err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null; // Optionally render a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;