import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { MatchesPage } from './pages/MatchesPage';
import { MessagesPage } from './pages/MessagesPage';
import { MessageDetailPage } from './pages/MessageDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { VerificationPage } from './pages/VerificationPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SafetyPage } from './pages/SafetyPage';

// TODO: Implement authentication service integration
// TODO: Add real profile service integration
// TODO: Implement real-time messaging with Socket.io
// TODO: Integrate payment system with Stripe
// TODO: Add encryption for sensitive data
// TODO: Implement API integration layer

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GF'd...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:id" element={<MessageDetailPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/safety" element={<SafetyPage />} />
      </Routes>
    </Router>
  );
}

export default App;