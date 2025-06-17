// /components/ResultsChart.tsx - VERSÃO CORRIGIDA

"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registra os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface ResultsChartProps {
  chartData: {
    title: string;
    data: ChartData;
  };
}

const ResultsChart = ({ chartData }: ResultsChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#FFFFFF",
        },
      },
      title: {
        display: true,
        text: chartData.title,
        color: "#FFFFFF",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems: any) {
            return tooltipItems[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#DDDDDD",
          // CORREÇÃO AQUI: Usamos o 'index' para pegar o label diretamente dos dados.
          callback: function(value: any, index: number, ticks: any) {
            // Acessa o array de labels original que foi passado para o gráfico
            const label = chartData.data.labels[index];
            
            // Verifica se o label existe e se é muito longo
            if (label && label.length > 30) {
              return label.substring(0, 30) + "...";
            }
            return label; // Retorna o label original ou resumido
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#DDDDDD",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Bar options={options} data={chartData.data} />
    </div>
  );
};

export default ResultsChart;