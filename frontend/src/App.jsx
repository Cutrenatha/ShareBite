import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotifProvider } from './context/NotifContext';
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DonationsPage from './pages/DonationsPage';
import DonationFormPage from './pages/DonationFormPage';
import PickupsPage from './pages/PickupsPage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

const Protected = ({ children }) => { const { user, loading } = useAuth(); if (loading) return <LoadingScreen />; if (!user) return <Navigate to="/login" replace />; return children; };
const Public = ({ children }) => { const { user, loading } = useAuth(); if (loading) return <LoadingScreen />; if (user) return <Navigate to="/dashboard" replace />; return children; };

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Toaster position="top-right" />
      {user ? (
        <NotifProvider>
          <Routes>
            <Route path="/" element={<Protected><Layout /></Protected>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="donations" element={<DonationsPage />} />
              <Route path="donations/new" element={<DonationFormPage />} />
              <Route path="donations/edit/:id" element={<DonationFormPage />} />
              <Route path="pickups" element={<PickupsPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </NotifProvider>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Public><RegisterPage /></Public>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>;
}
