"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#20E673', '#8884d8', '#ffc658', '#FF8042', '#00C49F', '#AF19FF', '#FF1943'];

interface ThemeTrendsChartProps {
  data: any[];
  selectedThemes: string[];
}

const ThemeTrendsChart: React.FC<ThemeTrendsChartProps> = ({ data, selectedThemes }) => {
  return (
    <div className="h-[500px] bg-[#222222] p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="year" stroke="#ccc" name="Ano" />
          <YAxis stroke="#ccc" allowDecimals={false} name="Quantidade" />
          <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "#fff" }} />
          <Legend />
          {selectedThemes.map((theme, index) => (
            <Line
              key={theme}
              type="monotone"
              dataKey={theme}
              name={theme}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              activeDot={{ r: 8 }}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThemeTrendsChart;