// /app/tendencias/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { loadAllTccData } from "../../dataService";
import { ProcessedTccItem, ThemeFrequency } from "@/types";
import { getThemesSortedByFrequency, trackThemeTrends } from "@/utils/tccUtils";

import Header from "@/components/header";
import ThemeTrendsChart from "@/components/ThemeTrendsChart";

function TendenciasPage() {
  const [allTccs, setAllTccs] = useState<ProcessedTccItem[]>([]);
  const [allThemes, setAllThemes] = useState<ThemeFrequency[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efeito para buscar os dados iniciais, uma única vez.
  useEffect(() => {
    async function initialFetch() {
      setIsLoading(true);
      const { allProcessedTccs } = await loadAllTccData();
      // A função getThemesSortedByFrequency já opera sobre os temas normalizados
      const themesByFrequency = getThemesSortedByFrequency(allProcessedTccs);

      setAllTccs(allProcessedTccs);
      setAllThemes(themesByFrequency);

      if (themesByFrequency.length > 0) {
        const topThemes = themesByFrequency.map((tf) => tf.theme).slice(0, 3); // Usa .theme
        setSelectedThemes(topThemes);
      }

      setIsLoading(false);
    }
    initialFetch();
  }, []);

  // Efeito para atualizar o gráfico sempre que a seleção de temas mudar.
  useEffect(() => {
    if (allTccs.length > 0) {
      const data = trackThemeTrends(allTccs, selectedThemes);
      setChartData(data);
    }
  }, [allTccs, selectedThemes]);

  const handleThemeChange = (theme: string) => {
    setSelectedThemes((prevSelected) =>
      prevSelected.includes(theme) ? prevSelected.filter((t) => t !== theme) : [...prevSelected, theme]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen mx-[40px] py-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#20E673] mb-4"></div>
        <h1 className="text-xl font-medium text-gray-300">Carregando dados... </h1>
      </div>
    );
  }

  return (
    <div className="mx-[40px] py-8">
      <Header />
      <motion.h1
        className="text-[24px] font-medium mb-4 text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Evolução dos Temas de Pesquisa ao Longo dos Anos
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Coluna do Gráfico */}
        <motion.div
          className="lg:w-3/4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ThemeTrendsChart data={chartData} selectedThemes={selectedThemes} />
        </motion.div>

        {/* Coluna dos Filtros */}
        <motion.div
          className="lg:w-1/4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-[#222222] p-4 rounded-lg max-h-[500px] overflow-y-auto">
            <h3 className="font-semibold text-lg text-gray-100 mb-3 border-b border-gray-700 pb-2">
              Selecione os Temas
            </h3>
            <div className="flex flex-col gap-2 pt-2">
              {allThemes.map((themeObj) => (
                <label
                  key={themeObj.tema}
                  className="flex items-center justify-between gap-3 p-2 rounded-md text-gray-300 cursor-pointer hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#20E673] focus:ring-2 focus:ring-offset-0 focus:ring-offset-gray-800 focus:ring-[#20E673]"
                      checked={selectedThemes.includes(themeObj.tema)}
                      onChange={() => handleThemeChange(themeObj.tema)}
                    />
                    <span className="flex-1">{themeObj.tema}</span>
                  </div>
                  <span className="text-xs font-mono bg-gray-700 text-gray-400 rounded-full px-2 py-0.5">
                    {themeObj.frequencia}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TendenciasPage;
