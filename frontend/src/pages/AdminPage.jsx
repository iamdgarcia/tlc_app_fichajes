import React, { useState, useContext } from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import UserCRUD from '../components/Admin/UserCRUD';
import AuditTable from '../components/Admin/AuditTable';
import { ThemeContext } from '../App';

const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'users', label: 'Usuarios', icon: '👥' },
  { key: 'audit', label: 'Auditoría', icon: '📝' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { dark } = useContext(ThemeContext);

  return (
    <div className={dark ? 'min-h-screen bg-gray-900 text-white flex flex-col md:flex-row' : 'min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row'}>
      {/* Sidebar */}
      <aside className={
        (sidebarOpen ? 'w-56' : 'w-16') +
        ' h-16 md:h-screen flex flex-row md:flex-col transition-all duration-300 ' +
        (dark ? 'bg-blue-900 border-r border-gray-800' : 'bg-blue-700 border-r border-gray-200')
      } aria-label="Menú de navegación">
        <button
          className="p-2 m-2 rounded hover:bg-blue-800 dark:hover:bg-blue-950 transition-all"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {sidebarOpen ? '⬅️' : '➡️'}
        </button>
        <nav className="flex flex-row md:flex-col gap-2 mt-4" aria-label="Opciones de administración">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-left ' +
                (tab === item.key
                  ? (dark ? 'bg-blue-800 font-bold' : 'bg-blue-600 font-bold')
                  : (dark ? 'hover:bg-blue-800' : 'hover:bg-blue-600'))
              }
              aria-current={tab === item.key ? 'page' : undefined}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-4 max-w-6xl mx-auto" aria-live="polite">
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'users' && <UserCRUD />}
        {tab === 'audit' && <AuditTable />}
      </main>
      <style>{`
        @media (max-width: 700px) {
          aside { width: 100vw !important; min-width: 0 !important; height: 56px !important; }
          main { padding: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
}
