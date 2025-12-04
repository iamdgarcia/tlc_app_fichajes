import React, { useState } from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import UserCRUD from '../components/Admin/UserCRUD';
import AuditTable from '../components/Admin/AuditTable';

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-4 p-4 bg-blue-700 text-white">
        <button onClick={() => setTab('dashboard')} className={tab==='dashboard' ? 'underline' : ''}>Dashboard</button>
        <button onClick={() => setTab('users')} className={tab==='users' ? 'underline' : ''}>Usuarios</button>
        <button onClick={() => setTab('audit')} className={tab==='audit' ? 'underline' : ''}>Auditoría</button>
      </nav>
      {tab === 'dashboard' && <AdminDashboard />}
      {tab === 'users' && <UserCRUD />}
      {tab === 'audit' && <AuditTable />}
    </div>
  );
}
