// src/components/TreemapChart.tsx
import React from "react";
import Plot from "react-plotly.js";
import { ThemeFrequency } from "../types";
import type { PlotMouseEvent } from "plotly.js";

interface TreemapChartProps {
  data: ThemeFrequency[];
  onSelectTheme: (theme: string) => void;
}

const TreemapChart: React.FC<TreemapChartProps> = ({ data, onSelectTheme }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-[#222222] border border-[#525252] rounded-lg text-gray-400">
        Não há dados para exibir no gráfico.
      </div>
    );
  }

  const labels = data.map((item) => item.tema);
  const values = data.map((item) => item.frequencia);
  const parents = data.map(() => "");

  const handleTreemapClick = (eventData: PlotMouseEvent) => {
    if (eventData.points && eventData.points.length > 0) {
      const clickedPoint = eventData.points[0];
      const themeName = clickedPoint.label;
      if (typeof themeName === "string" && themeName) {
        onSelectTheme(themeName);
      }
    }
  };

  return (
    <div className="bg-[#222222] p-4 rounded-lg border border-[#525252]">
      <Plot
        data={[
          {
            type: "treemap",
            labels: labels,
            parents: parents,
            values: values,
            textinfo: "label+value+percent root",
            hoverinfo: "label+value+percent parent",
            marker: {
              line: {
                color: "#525252",
                width: 0.5,
              },
            },
            textfont: {
              color: "#E5E7EB",
            },
            pathbar: {
              visible: data.some((d) => d.parents && d.parents !== ""),
              textfont: { color: "#D1D5DB" },
            },
          },
        ]}
        layout={{
          margin: { t: 10, l: 10, r: 10, b: 10 },
          height: 500,
          paper_bgcolor: "#222222",
          plot_bgcolor: "#222222",
          font: {
            color: "#E5E7EB",
          },
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        onClick={handleTreemapClick}
        config={{
          displaylogo: false,
        }}
      />
    </div>
  );
};

export default TreemapChart;
