import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import Navbar from './components/Navbar'; // 실제 Navbar 경로에 맞게 수정
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import Dining from './pages/Dining';
import Facilities from './pages/Facilities';
import Directions from './pages/Directions';
import FindUsername from './pages/FindUsername';
import FindPassword from './pages/FindPassword';
import Reviews from './pages/Reviews'; // 고객 후기 페이지 import

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RoomManagement from './pages/admin/RoomManagementFixed';
import GuestManagement from './pages/admin/GuestManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';

/**
 * Navbar를 포함하는 메인 레이아웃 컴포넌트
 * 이 컴포넌트로 감싸진 페이지들은 모두 상단에 Navbar가 나타납니다.
 */
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 고객용 사이트 라우트 */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/rooms" element={<MainLayout><Rooms /></MainLayout>} />
          <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
          <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/dining" element={<MainLayout><Dining /></MainLayout>} />
          <Route path="/facilities" element={<MainLayout><Facilities /></MainLayout>} />
          <Route path="/location" element={<MainLayout><Directions /></MainLayout>} />
          <Route path="/find-username" element={<MainLayout><FindUsername /></MainLayout>} />
          <Route path="/find-password" element={<MainLayout><FindPassword /></MainLayout>} />
          {/* --- 경로 수정 --- */}
          <Route path="/reviews" element={<MainLayout><Reviews /></MainLayout>} />
          
          <Route 
            path="/mypage" 
            element={<ProtectedRoute><MainLayout><MyPage /></MainLayout></ProtectedRoute>} 
          />

          {/* 관리자 사이트 라우트 */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute requireAdmin={true}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} 
          />
          <Route 
            path="/admin/rooms" 
            element={<ProtectedRoute requireAdmin={true}><AdminLayout><RoomManagement /></AdminLayout></ProtectedRoute>} 
          />
          <Route 
            path="/admin/guests" 
            element={<ProtectedRoute requireAdmin={true}><AdminLayout><GuestManagement /></AdminLayout></ProtectedRoute>} 
          />
          <Route 
            path="/admin/reservations" 
            element={<ProtectedRoute requireAdmin={true}><AdminLayout><ReservationManagement /></AdminLayout></ProtectedRoute>} 
          />
          <Route 
            path="/admin/reports" 
            element={<ProtectedRoute requireAdmin={true}><AdminLayout><ReportsAnalytics /></AdminLayout></ProtectedRoute>} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;