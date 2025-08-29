import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Header from '../components/admin/AdminHeader'
import Sidebar from '../components/admin/AdminSidebar'
import Login from '../pages/auth/LoginPage'
import Register from '../pages/auth/RegisterPage'
import Dashboard from '../pages/admin/AdminDashboard'
import Reservations from '../pages/admin/ReservationManagement'
import Rooms from '../pages/admin/RoomManagementFixed'
import Guests from '../pages/admin/GuestManagement'
import Reports from '../pages/admin/ReportsAnalytics'
import CustomerHome from '../pages/customer/CustomerHomePage'
import TestPage from '../pages/TestPage'
import '../styles/App.css'

function App() {
    return (
        <Router>
            <Routes>
                {/* 고객용 홈페이지 */}
                <Route path="/" element={<CustomerHome />} />

                {/* 인증 관련 페이지 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 보호된 관리자 애플리케이션 */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Navigate to="/admin/dashboard" replace />
                    </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                        <div className="app">
                            <Header />
                            <div className="app-body">
                                <Sidebar />
                                <main className="main-content">
                                    <Dashboard />
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/admin/reservations" element={
                    <ProtectedRoute>
                        <div className="app">
                            <Header />
                            <div className="app-body">
                                <Sidebar />
                                <main className="main-content">
                                    <Reservations />
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/admin/rooms" element={
                    <ProtectedRoute>
                        <div className="app">
                            <Header />
                            <div className="app-body">
                                <Sidebar />
                                <main className="main-content">
                                    <Rooms />
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/admin/guests" element={
                    <ProtectedRoute>
                        <div className="app">
                            <Header />
                            <div className="app-body">
                                <Sidebar />
                                <main className="main-content">
                                    <Guests />
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                    <ProtectedRoute>
                        <div className="app">
                            <Header />
                            <div className="app-body">
                                <Sidebar />
                                <main className="main-content">
                                    <Reports />
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    )
}

export default App
