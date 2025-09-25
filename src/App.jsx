import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HomePage from '@/pages/HomePage';
import CreateSalonPage from '@/pages/CreateSalonPage';
import AdminDashboard from '@/pages/AdminDashboard';
import BookingPage from '@/pages/BookingPage';
import LoginPage from '@/pages/LoginPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentFailurePage from '@/pages/PaymentFailurePage';
import PaymentPendingPage from '@/pages/PaymentPendingPage';
import { useAuth } from '@/contexts/SupabaseAuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>SalonFlow - Gestión Moderna para Salones de Belleza</title>
        <meta name="description" content="La plataforma más moderna para gestionar tu salón de belleza y peluquería. Reservas online, panel administrativo y mucho más." />
      </Helmet>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-salon" element={user ? <Navigate to="/admin" /> : <CreateSalonPage />} />
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <LoginPage />} />
        <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/book/:salonId" element={<BookingPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/failure" element={<PaymentFailurePage />} />
        <Route path="/payment/pending" element={<PaymentPendingPage />} />
      </Routes>
    </>
  );
}

export default App;