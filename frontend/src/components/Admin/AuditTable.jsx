import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="p-2"><div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-20" /></td>
      ))}
    </tr>
  );
}

export default function AuditTable() {
  const [clockings, setClockings] = useState(null);
  const [filters, setFilters] = useState({ date: '', dni: '' });
  const [loading, setLoading] = useState(false);

  const fetchClockings = () => {
    setLoading(true);
    setClockings(null);
    axios.get('/api/admin/audit', { params: filters, withCredentials: true })
      .then(res => setClockings(res.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchClockings(); }, [filters]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Auditoría de Fichajes</h2>
      <div className="flex gap-4 mb-4">
        <input className="border p-2 rounded" type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} aria-label="Filtrar por fecha" />
        <input className="border p-2 rounded" placeholder="DNI Empleado" value={filters.dni} onChange={e => setFilters(f => ({ ...f, dni: e.target.value }))} aria-label="Filtrar por DNI" />
        <button className={"bg-blue-600 text-white px-4 py-2 rounded transition-all hover:scale-105 " + (loading ? 'opacity-60 cursor-not-allowed' : '')} onClick={fetchClockings} disabled={loading} aria-busy={loading}>Filtrar</button>
      </div>
      <table className="w-full bg-white dark:bg-gray-800 rounded shadow" aria-live="polite">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2">Empleado</th>
            <th className="p-2">DNI</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Entrada</th>
            <th className="p-2">Salida</th>
          </tr>
        </thead>
        <tbody>
          {clockings
            ? clockings.length > 0
              ? clockings.map(c => (
                  <tr key={c.id}>
                    <td className="p-2">{c.user?.name}</td>
                    <td className="p-2">{c.user?.dni}</td>
                    <td className="p-2">{c.type}</td>
                    <td className="p-2">{c.timeIn ? new Date(c.timeIn).toLocaleString() : <span className="text-gray-400">—</span>}</td>
                    <td className="p-2">{c.timeOut ? new Date(c.timeOut).toLocaleString() : <span className="text-gray-400">—</span>}</td>
                  </tr>
                ))
              : <tr><td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">No hay fichajes para los filtros seleccionados.</td></tr>
            : Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          }
        </tbody>
      </table>
    </div>
  );
}
