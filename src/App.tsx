import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { HomePage } from './pages/home-page';
import { AboutPage } from './pages/about-page';
import { DisclaimerPage } from './pages/disclaimer-page';
import { MedicinesPage } from './pages/medicines-page';
import { MedicineDetailPage } from './pages/medicine-detail-page';
import { CreateMedicinePage } from './pages/create-medicine-page';
import { EditMedicinePage } from './pages/edit-medicine-page';
import { DashboardPage } from './pages/dashboard-page';
import { LoginPage } from './pages/login-page';
import { SignupPage } from './pages/signup-page';
import { NotFoundPage } from './pages/not-found-page';
import { useAuthStore } from './store/auth-store';
import { ProtectedRoute } from './components/auth/protected-route';

function App() {
  const { getUser } = useAuthStore();
  
  useEffect(() => {
    // Check for existing session on app load
    getUser();
  }, [getUser]);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicines/:id" element={<MedicineDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Donor-Only Routes */}
            <Route 
              path="/medicines/new" 
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <CreateMedicinePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/medicines/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <EditMedicinePage />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;