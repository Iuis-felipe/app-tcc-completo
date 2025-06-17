"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { loadAllTccData } from "../../dataService";
import { TccCountByYear, countTccsByYear } from "@/utils/tccUtils";
import Header from "@/components/header";
import KpiCard from "@/components/KpiCard";

const BarChart = dynamic(() => import("../../components/TccBarChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-[#222222] rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#20E673]"></div>
      <p className="ml-3 text-gray-400">Carregando gráfico...</p>
    </div>
  ),
});

function AnaliseAnualPage() {
  const [tccsPorAno, setTccsPorAno] = useState<TccCountByYear[]>([]);
  const [totalTccs, setTotalTccs] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const { allProcessedTccs } = await loadAllTccData();

        const annualCounts = countTccsByYear(allProcessedTccs);
        setTccsPorAno(annualCounts);

        // MUDANÇA 3: Calcular e definir o total de TCCs. É o tamanho do array!
        setTotalTccs(allProcessedTccs.length);

        setError(null);
      } catch (err) {
        console.error("Erro na AnaliseAnualPage ao buscar dados:", err);
        const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
        setError(`Falha ao carregar os dados dos TCCs: ${errorMessage}`);
        setTccsPorAno([]);
        setTotalTccs(0);
      } finally {
        setIsLoading(false);
      }
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

  if (error) {
    return (
      <div className="min-h-screen mx-[40px] py-8">
        <Header />
        <div className="mt-10 p-6 bg-[#222222] border border-[#525252] rounded-lg text-center">
          <h1 className="text-2xl font-semibold text-red-400 mb-3">Oops! Algo deu errado 😥</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-[40px] py-8">
      <Header />
      <h1 className="text-[24px] font-medium mb-6 text-gray-100">Dashboard de Análise de TCCs</h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <KpiCard title="Total de TCCs Cadastrados" value={totalTccs} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }} // Atraso maior ainda
      >
        <h2 className="text-[20px] font-medium mb-4 text-gray-200">Distribuição por Ano</h2>

        {tccsPorAno.length === 0 && !isLoading ? (
          <div className="mt-10 p-6 bg-[#222222] border border-[#525252] rounded-lg text-center">
            <p className="text-gray-300">Nenhum dado de TCC encontrado para gerar o gráfico.</p>
          </div>
        ) : (
          <div className="mt-4">
            <BarChart data={tccsPorAno} />
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AnaliseAnualPage;
