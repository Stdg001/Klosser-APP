import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import MainLayout from '../pages/layout/MainLayout';
import PhoneLayout from '../pages/layout/PhoneLayout';
import Home from '../pages/Home';
import Lesson from '../components/Lesson';
import Auth from '../pages/Auth';

const PrivateRoute = ( {children} ) => {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return <div> Cargando... </div>;
  }

  if (!userData) {
    <Navigate to='/login' replace />
  }

  return children;
}

const Router = () => {
  const isMobile = false;
  return (
    <Routes>
      <Route path="auth" element={<Auth />} />
      <Route path="/"
        element={
          <PrivateRoute>
            {isMobile ? <PhoneLayout /> : <MainLayout />}
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="leaderboard" element={''} />
        <Route path="rewards" element={''} />

        <Route path="lesson" element={<Lesson />} />
      </Route>
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  )
}

export default Router