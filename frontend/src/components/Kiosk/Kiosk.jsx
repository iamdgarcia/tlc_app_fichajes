
import React, { useState } from 'react';
import axios from 'axios';

export default function Kiosk() {
  const [modal, setModal] = useState(false);
  const [dni, setDni] = useState('');
  const [type, setType] = useState('ENTRADA');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const openModal = (clockType) => {
    setType(clockType);
    setModal(true);
    setDni('');
    setFeedback(null);
  };

  const handleClock = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await axios.post('/api/clocking', { dni, type });
      setFeedback({ success: true, msg: `Fichaje correcto: ${res.data.time}` });
      setModal(false);
    } catch (err) {
      setFeedback({ success: false, msg: err.response?.data?.error || 'Error de fichaje' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative p-4">
      <div className="kiosk-glass flex flex-col items-center max-w-2xl w-full px-10 py-14">
        <h1 className="kiosk-title text-3xl font-bold mb-12">Control de Fichajes</h1>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full mb-8">
          <button
            className="kiosk-btn entrada"
            style={{minWidth:'220px'}}
            onClick={() => openModal('ENTRADA')}
          >
            ENTRADA
          </button>
          <button
            className="kiosk-btn salida"
            style={{minWidth:'220px'}}
            onClick={() => openModal('SALIDA')}
          >
            SALIDA
          </button>
        </div>
        {feedback && !modal && (
          <div className="kiosk-feedback mt-6" style={{background: feedback.success ? 'rgba(67,233,123,0.18)' : 'rgba(250,112,154,0.18)', color: feedback.success ? '#43e97b' : '#fa709a'}}>{feedback.msg}</div>
        )}
      </div>

      {/* Modal popup flotante */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="kiosk-glass flex flex-col items-center min-w-[340px] px-10 py-12 relative animate-fadein z-10 shadow-2xl border-2 border-blue-400">
            <h2 className="text-2xl font-bold mb-8 text-[var(--text-primary)] tracking-wide">Introduce tu DNI</h2>
            <input
              className="border-2 border-blue-400 px-8 py-4 rounded-xl mb-8 text-2xl text-center focus:outline-none focus:border-blue-500 transition-all w-72 bg-transparent text-[var(--text-primary)] tracking-widest shadow"
              value={dni}
              onChange={e => setDni(e.target.value)}
              disabled={loading}
              autoFocus
              placeholder="DNI"
              maxLength={12}
            />
            <div className="flex gap-8 w-full justify-center">
              <button
                className="kiosk-btn entrada text-xl py-3 px-8"
                style={{fontSize:'1.5rem', minWidth:'120px'}}
                onClick={handleClock}
                disabled={loading || !dni}
              >
                {loading ? 'Enviando...' : 'Confirmar'}
              </button>
              <button
                className="kiosk-btn salida text-xl py-3 px-8"
                style={{fontSize:'1.5rem', minWidth:'120px'}}
                onClick={() => setModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
            {feedback && (
              <div className="kiosk-feedback mt-6" style={{background: feedback.success ? 'rgba(67,233,123,0.18)' : 'rgba(250,112,154,0.18)', color: feedback.success ? '#43e97b' : '#fa709a'}}>{feedback.msg}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
