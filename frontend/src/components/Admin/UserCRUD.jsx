import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SkeletonRow() {
  return (
    <tr>
      <td className="p-2"><div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-24" /></td>
      <td className="p-2"><div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-16" /></td>
      <td className="p-2"><div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-20" /></td>
      <td className="p-2"><div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-12" /></td>
      <td className="p-2 flex gap-2"><div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-20" /></td>
    </tr>
  );
}

export default function UserCRUD() {
  const [users, setUsers] = useState(null);
  const [form, setForm] = useState({ id: null, name: '', dni: '', position: '', password: '' });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setUsers(null);
    axios.get('/api/users').then(res => setUsers(res.data));
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editing) {
        await axios.put(`/api/users/${form.id}`, form);
      } else {
        await axios.post('/api/users', form);
      }
      setForm({ id: null, name: '', dni: '', position: '', password: '' });
      setEditing(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = user => {
    setForm({ ...user, password: '' });
    setEditing(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    setLoading(true);
    await axios.delete(`/api/users/${id}`);
    fetchUsers();
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      <form className="mb-6 flex gap-4 items-end" onSubmit={handleSubmit}>
        <input className="border p-2 rounded" placeholder="Nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="DNI" value={form.dni} onChange={e => setForm(f => ({ ...f, dni: e.target.value }))} required disabled={editing} />
        <input className="border p-2 rounded" placeholder="Puesto" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Contraseña" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={!editing} />
        <button className={"bg-blue-600 text-white px-4 py-2 rounded transition-all hover:scale-105 " + (loading ? 'opacity-60 cursor-not-allowed' : '')} type="submit" disabled={loading}>{editing ? 'Actualizar' : 'Crear'}</button>
        {editing && <button className={"bg-gray-400 text-white px-4 py-2 rounded transition-all hover:scale-105 " + (loading ? 'opacity-60 cursor-not-allowed' : '')} type="button" onClick={() => { setEditing(false); setForm({ id: null, name: '', dni: '', position: '', password: '' }); }} disabled={loading}>Cancelar</button>}
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2">Nombre</th>
            <th className="p-2">DNI</th>
            <th className="p-2">Puesto</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users
            ? users.length > 0
              ? users.map(u => (
                  <tr key={u.id}>
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.dni}</td>
                    <td className="p-2">{u.position}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-yellow-400 px-2 py-1 rounded transition-all hover:scale-105" onClick={() => handleEdit(u)} disabled={loading}>Editar</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded transition-all hover:scale-105" onClick={() => handleDelete(u.id)} disabled={loading}>Eliminar</button>
                    </td>
                  </tr>
                ))
              : <tr><td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">No hay usuarios registrados.</td></tr>
            : Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          }
        </tbody>
      </table>
    </div>
  );
}
