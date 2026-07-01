import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { initializeTheme } from './store/authSlice';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './pages/UserDashboard';
import { AiAssistant } from './pages/AiAssistant';
import { FoodDatabase } from './pages/FoodDatabase';
import { Appointments } from './pages/Appointments';
import { ChatRooms } from './pages/ChatRooms';
import { History } from './pages/History';
import { Recipes } from './pages/Recipes';
import { DietitianDashboard } from './pages/DietitianDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import './index.css';

// Initialize UI theme from storage on start
store.dispatch(initializeTheme());

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Promotional Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected General Client Hub */}
          <Route element={<ProtectedRoute allowedRoles={['User']} />}>
            <Route path="/dashboard" element={<LayoutWrapper><UserDashboard /></LayoutWrapper>} />
            <Route path="/ai-planner" element={<LayoutWrapper><AiAssistant /></LayoutWrapper>} />
            <Route path="/history" element={<LayoutWrapper><History /></LayoutWrapper>} />
          </Route>

          {/* Protected Dietitian and Specialist Workspace */}
          <Route element={<ProtectedRoute allowedRoles={['Dietitian', 'Nutritionist']} />}>
            <Route path="/dietitian-dashboard" element={<LayoutWrapper><DietitianDashboard /></LayoutWrapper>} />
          </Route>

          {/* Protected Admin Command Center */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin-dashboard" element={<LayoutWrapper><AdminDashboard /></LayoutWrapper>} />
          </Route>

          {/* Protected Shared Pages */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Dietitian', 'Nutritionist', 'Admin']} />}>
            <Route path="/food-database" element={<LayoutWrapper><FoodDatabase /></LayoutWrapper>} />
            <Route path="/recipes" element={<LayoutWrapper><Recipes /></LayoutWrapper>} />
            <Route path="/appointments" element={<LayoutWrapper><Appointments /></LayoutWrapper>} />
            <Route path="/chat" element={<LayoutWrapper><ChatRooms /></LayoutWrapper>} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
