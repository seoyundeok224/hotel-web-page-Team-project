import React from 'react';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AdminNavbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
