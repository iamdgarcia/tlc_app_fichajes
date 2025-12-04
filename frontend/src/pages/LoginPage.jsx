import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async e => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('/api/admin/login', { dni, password }, { withCredentials: true });
      window.location.href = '/admin';
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow w-80" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6">Login Admin</h2>
        <input className="border p-2 rounded w-full mb-4" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} required />
        <input className="border p-2 rounded w-full mb-4" placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Entrar</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}
