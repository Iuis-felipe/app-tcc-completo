// /components/TopAuthorsChart.tsx

"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CountByAuthor } from '@/utils/tccUtils'; // Importamos nosso novo tipo

interface TopAuthorsChartProps {
  data: CountByAuthor[];
}

const TopAuthorsChart: React.FC<TopAuthorsChartProps> = ({ data }) => {
  return (
    <div className="h-[450px] bg-[#222222] p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical" // Define a orientação do gráfico como horizontal
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0, // Margem esquerda maior para caber os nomes dos orientadores
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis type="number" stroke="#ccc" />
          <YAxis
            dataKey="name" // O eixo Y agora mostra os nomes
            type="category" // do tipo "categoria"
            stroke="#ccc"
            width={50} // Largura fixa para o eixo Y
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
             contentStyle={{ backgroundColor: "#333", border: "none" }}
             labelStyle={{ color: "#fff" }}
          />
          <Legend />
          <Bar dataKey="total" name="Nº de Orientações" fill="#20E673" animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopAuthorsChart;