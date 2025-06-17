"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { loadAllTccData } from "../../dataService";
import { getThemesSortedByFrequency, getTopThemesProportion } from "@/utils/tccUtils";

import Header from "@/components/header";
import ThemesDonutChart from "@/components/ThemesDonutChart";

function ProporcaoPage() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const { allProcessedTccs } = await loadAllTccData();

      const themesByFrequency = getThemesSortedByFrequency(allProcessedTccs);

      const proportionData = getTopThemesProportion(themesByFrequency, 7);

      setChartData(proportionData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen mx-[40px] py-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#20E673] mb-4"></div>
        <h1 className="text-xl font-medium text-gray-300">Carregando dados...</h1>
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
        Proporção dos Temas Mais Populares
      </motion.h1>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ThemesDonutChart data={chartData} />
      </motion.div>
    </div>
  );
}

export default ProporcaoPage;
