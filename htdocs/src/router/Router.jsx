import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

import MainLayout from '../pages/layout/MainLayout';
import PhoneLayout from '../pages/layout/PhoneLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Lesson from '../components/Lesson';


const PrivateRoute = ( {children} ) => {
  // const { isLoading, userData } = useAuth();

  // if (isLoading) {
  //   return <div> Cargando... </div>;
  // }

  // if (!userData) {
  //   <Navigate to='/unauthorized' replace />
  // }

  // if (!roles?.includes(userData?.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
}

const Router = () => {
  const isMobile = false;
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/"
        element={
          <PrivateRoute>
            {isMobile ? <PhoneLayout /> : <MainLayout />}
          </PrivateRoute>
        }
      >
      <Route index element={<Navigate to="/home" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="lesson" element={<Lesson />} />
      
      {/* <Route path="dashboard" element={<Dashboard />} />
      <Route path="workOrders" element={<WorkOrder />} />
      <Route path="settings" element={<Settings />} /> */}
      </Route>
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  )
}

export default Router