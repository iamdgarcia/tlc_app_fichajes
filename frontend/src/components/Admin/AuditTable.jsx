import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AuditTable() {
  const [clockings, setClockings] = useState([]);
  const [filters, setFilters] = useState({ date: '', dni: '' });

  const fetchClockings = () => {
    axios.get('/api/admin/audit', { params: filters, withCredentials: true }).then(res => setClockings(res.data));
  };
  useEffect(() => { fetchClockings(); }, [filters]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Auditoría de Fichajes</h2>
      <div className="flex gap-4 mb-4">
        <input className="border p-2 rounded" type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
        <input className="border p-2 rounded" placeholder="DNI Empleado" value={filters.dni} onChange={e => setFilters(f => ({ ...f, dni: e.target.value }))} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchClockings}>Filtrar</button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Empleado</th>
            <th className="p-2">DNI</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Entrada</th>
            <th className="p-2">Salida</th>
          </tr>
        </thead>
        <tbody>
          {clockings.map(c => (
            <tr key={c.id}>
              <td className="p-2">{c.user?.name}</td>
              <td className="p-2">{c.user?.dni}</td>
              <td className="p-2">{c.type}</td>
              <td className="p-2">{c.timeIn ? new Date(c.timeIn).toLocaleString() : ''}</td>
              <td className="p-2">{c.timeOut ? new Date(c.timeOut).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
