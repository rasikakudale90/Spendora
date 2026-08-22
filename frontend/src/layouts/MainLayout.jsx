import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { ToastContainer } from '../components/common/Toast';
import '../styles/index.css';
import '../styles/components.css';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/expenses': 'Expenses',
  '/analytics': 'Analytics',
  '/budgets': 'Budgets',
};

export const MainLayout = () => {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Spendora';

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar pageTitle={pageTitle} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
