"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#20E673", "#0088FE", "#FFBB28", "#FF8042", "#AF19FF", "#8884d8", "#00C49F", "#FF4560"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface ThemesDonutChartProps {
  data: { name: string; value: number }[];
}

const ThemesDonutChart: React.FC<ThemesDonutChartProps> = ({ data }) => {
  return (
    <div className="h-[500px] bg-[#222222] p-4 rounded-lg flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={80}
            outerRadius={160}
            fill="#8884d8"
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "6px" }} labelStyle={{ color: "#fff" }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThemesDonutChart;
