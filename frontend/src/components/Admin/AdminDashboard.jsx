import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function SkeletonBox({ width = '100%', height = 40 }) {
  return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded" style={{ width, height }} />;
}

export default function AdminDashboard() {
  const [kpi, setKpi] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/kpi', { withCredentials: true }).then(res => setKpi(res.data));
    axios.get('/api/admin/chart', { withCredentials: true }).then(res => setChartData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="flex gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded p-6 flex-1 text-center">
          <div className="text-4xl font-bold">
            {kpi ? kpi.active : <SkeletonBox width={80} height={48} />}
          </div>
          <div>Empleados activos ahora</div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded p-6 flex-1 text-center">
          <div className="text-4xl font-bold">
            {kpi ? kpi.totalHours : <SkeletonBox width={80} height={48} />}
          </div>
          <div>Total horas semana actual</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
        <h3 className="text-lg font-semibold mb-4">Horas trabajadas por día (semana actual)</h3>
        {chartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonBox width="100%" height={300} />
        )}
      </div>
    </div>
  );
}
