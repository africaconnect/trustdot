import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/auth/AuthForm'
import { Dashboard } from './components/dashboard/Dashboard'
import { PublicProfile } from './components/profile/PublicProfile'
import { JobSubmissionForm } from './components/jobs/JobSubmissionForm'
import { PricingPage } from './components/pricing/PricingPage'
import { LandingPage } from './components/landing/LandingPage'
import { VendorRatingPage } from './components/rating/VendorRatingPage'
import { AdminPanel } from './components/admin/AdminPanel'
import { AdminVendors } from './components/admin/AdminVendors'
import NotFound from './components/NotFound'

function App() {
  const { user, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile/:vendorId" element={<PublicProfile />} />
          <Route path="/rate/:vendorId" element={<VendorRatingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          
          {/* Auth Routes */}
          <Route 
            path="/auth" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthForm 
                  mode={authMode} 
                  onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} 
                />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/jobs/new" 
            element={user ? <JobSubmissionForm /> : <Navigate to="/auth" replace />} 
          />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App