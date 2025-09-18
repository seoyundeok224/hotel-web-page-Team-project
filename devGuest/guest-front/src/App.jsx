import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import Dining from './pages/Dining';
import Facilities from './pages/Facilities';
import Directions from './pages/Directions'; // 오시는 길 페이지 추가
import FindUsername from './pages/FindUsername'; // 아이디 찾기 추가
import FindPassword from './pages/FindPassword'; // 비밀번호 찾기 추가

// 관리자 페이지들
import AdminDashboard from './pages/admin/AdminDashboard';
import RoomManagement from './pages/admin/RoomManagementFixed';
import GuestManagement from './pages/admin/GuestManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';

// 컨텍스트와 보호된 라우트
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 고객 사이트 라우트 */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          <Route path="/rooms" element={
            <>
              <Navbar />
              <Rooms />
            </>
          } />
          <Route path="/services" element={
            <>
              <Navbar />
              <Services />
            </>
          } />
          <Route path="/booking" element={
            <>
              <Navbar />
              <Booking />
            </>
          } />
          <Route path="/login" element={
            <>
              <Navbar />
              <Login />
            </>
          } />
          <Route path="/register" element={
            <>
              <Navbar />
              <Register />
            </>
          } />
          <Route path="/dining" element={
            <>
              <Navbar />
              <Dining />
            </>
          } />
          <Route path="/facilities" element={
            <>
              <Navbar />
              <Facilities />
            </>
          } />
          <Route path="/location" element={
            <>
              <Navbar />
              <Directions />
            </>
          } />

          {/* 아이디 찾기 페이지 라우트 추가 */}
          <Route path="/find-username" element={
            <>
              <Navbar />
              <FindUsername />
            </>
          } />

          {/* 비밀번호 찾기 페이지 라우트 추가 */}
          <Route path="/find-password" element={
            <>
              <Navbar />
              <FindPassword />
            </>
          } />

          <Route path="/mypage" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <MyPage />
              </>
            </ProtectedRoute>
          } />

          {/* 관리자 사이트 라우트 */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/rooms" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout>
                <RoomManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/guests" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout>
                <GuestManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reservations" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout>
                <ReservationManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout>
                <ReportsAnalytics />
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;