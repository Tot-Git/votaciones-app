import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function ChartVotos({ candidatos, votos }) {
  
  const data = candidatos.map(c => ({
    name: c.nombre,
    votes: votos[c.id] || 0
  }));

  return (
    <div className="mt-5" style={{ width: '100%', height: 300 }}>
      <h2>Votos por Candidato</h2>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="votes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartVotos;
