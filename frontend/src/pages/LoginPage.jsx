import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../App';

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { dark } = useContext(ThemeContext);

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
    <div className={dark ? "flex flex-col items-center justify-center h-screen bg-gray-900 text-white" : "flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900"}>
      <form className={dark ? "bg-gray-800 p-8 rounded shadow w-80 border border-gray-700" : "bg-white p-8 rounded shadow w-80"} onSubmit={handleLogin} aria-label="Formulario de acceso administrador">
        <h2 className="text-2xl font-bold mb-6 text-center">Acceso Administrador</h2>
        <label htmlFor="dni" className="sr-only">DNI</label>
        <input id="dni" className={dark ? "border p-2 rounded w-full mb-4 bg-gray-900 text-white border-gray-700" : "border p-2 rounded w-full mb-4"} placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} required autoComplete="username" />
        <label htmlFor="password" className="sr-only">Contraseña</label>
        <input id="password" className={dark ? "border p-2 rounded w-full mb-4 bg-gray-900 text-white border-gray-700" : "border p-2 rounded w-full mb-4"} placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full transition-all hover:scale-105" type="submit" aria-busy={!!error}>Entrar</button>
        {error && <div className="text-red-600 mt-2 text-center" role="alert">{error}</div>}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">¿Olvidaste tu contraseña? Contacta con el administrador del sistema.</div>
      </form>
      <style>{`
        @media (max-width: 500px) {
          form { width: 100vw !important; min-width: 0 !important; padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
