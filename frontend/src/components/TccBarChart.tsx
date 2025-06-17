"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TccCountByYear } from "@/utils/tccUtils";

interface TccBarChartProps {
  data: TccCountByYear[];
}

const TccBarChart: React.FC<TccBarChartProps> = ({ data }) => {
  return (
    <div className="h-[500px] bg-[#222222] p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          {/* O eixo X mostrará o ano */}
          <XAxis dataKey="ano" stroke="#ccc" />
          {/* O eixo Y não precisa de label, 'allowDecimals' evita números quebrados */}
          <YAxis stroke="#ccc" allowDecimals={false} />
          {/* Tooltip é a caixinha que aparece ao passar o mouse */}
          <Tooltip
            contentStyle={{ backgroundColor: "#333", border: "none" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          {/* A barra do gráfico usará a 'quantidade' */}
          <Bar dataKey="quantidade" fill="#20E673" name="Nº de TCCs" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TccBarChart;