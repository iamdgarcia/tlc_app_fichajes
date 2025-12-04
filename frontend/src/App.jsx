
import React, { createContext, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KioskPage from './pages/KioskPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

export const ThemeContext = createContext({ dark: false, toggle: () => {} });

export default function App() {
  const [dark, setDark] = useState(() => {
    // Prefer system dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    return false;
  });
  const themeValue = useMemo(() => ({ dark, toggle: () => setDark(d => !d) }), [dark]);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className={dark ? 'bg-gray-900 text-white min-h-screen' : 'bg-gray-50 text-gray-900 min-h-screen'}>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={themeValue.toggle}
            className="px-3 py-2 rounded shadow bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 transition-all hover:scale-105"
            aria-label="Toggle dark mode"
          >
            {dark ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
          </button>
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<KioskPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}
