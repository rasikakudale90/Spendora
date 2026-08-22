import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
