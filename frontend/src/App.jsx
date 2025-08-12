import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PlantixLayout from './components/PlantixLayout';
import MainLayout from './components/MainLayout';
import PlantixChatbot from './components/PlantixChatbot';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

// Plantix App Pages
import HomePage from './pages/HomePage';
import GlassNavbar from './components/GlassNavbar';
import KrishiBandhuDashboard from './pages/KrishiBandhuDashboard';
import EcommercePage from './pages/EcommercePage';
import ProductListPage from './pages/ProductListPage';
import CameraPage from './pages/CameraPage';
import DiagnosisPage from './pages/DiagnosisPage';
import TreatmentPage from './pages/TreatmentPage';
import WeatherPage from './pages/WeatherPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import MarketplacePage from './pages/MarketplacePage';
import InventoryPage from './pages/InventoryPage';
import InvoicesPage from './pages/InvoicesPage';
import FinancialReportsPage from './pages/FinancialReportsPage';
import FavoritesPage from './pages/FavoritesPage';
import FeedbackPage from './pages/FeedbackPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ColdStoragePage from './pages/ColdStoragePage';
import DashboardHome from './pages/DashboardHome';
import LearnPage from './pages/LearnPage';
import LoansPage from './pages/LoansPage';
import NewsPage from './pages/NewsPage';
import ChatPage from './pages/ChatPage';
import FertilizerStorePage from './pages/FertilizerStorePage';
import FertilizerDealersPage from './pages/FertilizerDealersPage';
import CollaborationPage from './pages/CollaborationPage';
import SoilDetectionPage from './pages/SoilDetectionPage';

import MarketPricePage from './pages/MarketPricePage';
import ExpertLoginPage from './pages/ExpertLoginPage';
import ExpertPage from './pages/ExpertPage';
import ExpertDashboard from './pages/ExpertDashboard';
import ExpertChatPage from './pages/ExpertChatPage';
import VideoCallPage from './pages/VideoCallPage';
import LiveChatPage from './pages/LiveChatPage';



const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// App Routes Component
const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      
      {/* Protected Routes */}
      <Route path="/krishi-bandhu" element={<ProtectedRoute><MainLayout><KrishiBandhuDashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardHome /></MainLayout></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><MainLayout><NewsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/weather" element={<ProtectedRoute><MainLayout><WeatherPage /></MainLayout></ProtectedRoute>} />
      <Route path="/ecommerce" element={<ProtectedRoute><MainLayout><EcommercePage /></MainLayout></ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute><MainLayout><LoansPage /></MainLayout></ProtectedRoute>} />
      <Route path="/cold-storage" element={<ProtectedRoute><MainLayout><ColdStoragePage /></MainLayout></ProtectedRoute>} />
      <Route path="/camera" element={<ProtectedRoute><MainLayout><CameraPage /></MainLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><MainLayout><ChatPage /></MainLayout></ProtectedRoute>} />
      <Route path="/learn" element={<ProtectedRoute><MainLayout><LearnPage /></MainLayout></ProtectedRoute>} />
      <Route path="/fertilizer-store" element={<ProtectedRoute><MainLayout><FertilizerStorePage /></MainLayout></ProtectedRoute>} />
      <Route path="/fertilizer-dealers" element={<ProtectedRoute><MainLayout><FertilizerDealersPage /></MainLayout></ProtectedRoute>} />
      <Route path="/collaboration" element={<ProtectedRoute><MainLayout><CollaborationPage /></MainLayout></ProtectedRoute>} />
      <Route path="/soil-detection" element={<ProtectedRoute><MainLayout><SoilDetectionPage /></MainLayout></ProtectedRoute>} />

      <Route path="/market-prices" element={<ProtectedRoute><MainLayout><MarketPricePage /></MainLayout></ProtectedRoute>} />
      <Route path="/expert-login" element={<ExpertLoginPage />} />
      <Route path="/expert" element={<ProtectedRoute><MainLayout><ExpertPage /></MainLayout></ProtectedRoute>} />
      <Route path="/expert-dashboard" element={<ExpertDashboard />} />
      <Route path="/live-chat" element={<ProtectedRoute><MainLayout><LiveChatPage /></MainLayout></ProtectedRoute>} />
      <Route path="/live-chat/:roomId" element={<ExpertChatPage />} />
      <Route path="/expert-chat/:roomId" element={<ExpertChatPage />} />
      <Route path="/video-call/:roomId" element={<VideoCallPage />} />
      <Route path="/products/:category" element={<ProtectedRoute><MainLayout><ProductListPage /></MainLayout></ProtectedRoute>} />
      <Route path="/diagnosis" element={<ProtectedRoute><MainLayout><DiagnosisPage /></MainLayout></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
      <Route path="/farmer-dashboard" element={<ProtectedRoute><MainLayout><FarmerDashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/vendor-dashboard" element={<ProtectedRoute><MainLayout><VendorDashboard /></MainLayout></ProtectedRoute>} />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  // Set document title
  React.useEffect(() => {
    document.title = 'KrishiMitra';
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppRoutes />
          <PlantixChatbot />
        </Router>
        <Toaster position="top-right" reverseOrder={false} />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
