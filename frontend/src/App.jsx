
import React, { createContext, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KioskPage from './pages/KioskPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ThemeToggle from './components/ThemeToggle';

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
      <div className="min-h-screen transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
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
