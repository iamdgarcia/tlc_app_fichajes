import React, { useState, useContext } from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import UserCRUD from '../components/Admin/UserCRUD';
import AuditTable from '../components/Admin/AuditTable';
import { ThemeContext } from '../App';

// Simple SVG Icons
const Icons = {
  Dashboard: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  Audit: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  ),
  ChevronLeft: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
  ),
  ChevronRight: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
  )
};

const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
  { key: 'users', label: 'Usuarios', icon: <Icons.Users /> },
  { key: 'audit', label: 'Auditoría', icon: <Icons.Audit /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { dark } = useContext(ThemeContext);

  return (
    <div className={dark ? 'min-h-screen bg-gray-900 text-white flex flex-col md:flex-row' : 'min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row'}>
      {/* Sidebar */}
      <aside className={
        (sidebarOpen ? 'w-56' : 'w-20') +
        ' h-16 md:h-screen flex flex-row md:flex-col transition-all duration-300 ' +
        (dark ? 'bg-blue-900 border-r border-gray-800' : 'bg-blue-700 border-r border-gray-200')
      } aria-label="Menú de navegación">
        <button
          className="p-2 m-2 rounded hover:bg-blue-800 dark:hover:bg-blue-950 transition-all text-white"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {sidebarOpen ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
        </button>
        <nav className="flex flex-row md:flex-col gap-2 mt-4 w-full px-2" aria-label="Opciones de administración">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left text-white ' +
                (tab === item.key
                  ? (dark ? 'bg-blue-800 font-bold' : 'bg-blue-600 font-bold')
                  : (dark ? 'hover:bg-blue-800' : 'hover:bg-blue-600'))
              }
              aria-current={tab === item.key ? 'page' : undefined}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-4 max-w-6xl mx-auto w-full" aria-live="polite">
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'users' && <UserCRUD />}
        {tab === 'audit' && <AuditTable />}
      </main>
      <style>{`
        @media (max-width: 700px) {
          aside { width: 100vw !important; min-width: 0 !important; height: auto !important; flex-direction: row !important; }
          main { padding: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
}
