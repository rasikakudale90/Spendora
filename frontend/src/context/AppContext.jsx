import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AppContext.Provider value={{ toasts, addToast, removeToast, refreshTrigger, triggerRefresh }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
