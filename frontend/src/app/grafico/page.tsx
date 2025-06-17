"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { loadAllTccData } from "../../dataService";
import { DisplayTccItem, ThemeFrequency } from "../../types";
import ThemeSelector from "../../components/ThemeSelector";
import TccDisplay from "../../components/TccDisplay";
import Header from "@/components/header";

const TreemapChart = dynamic(() => import("../../components/TreemapChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-[#222222] rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#20E673]"></div>
      <p className="ml-3 text-gray-400">Carregando gráfico...</p>
    </div>
  ),
});

function GraficoPage() {
  const [allTccs, setAllTccs] = useState<DisplayTccItem[]>([]);
  const [themeFrequencies, setThemeFrequencies] = useState<ThemeFrequency[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { allDisplayTccs, themeFrequencies: freqs } = await loadAllTccData();
        setAllTccs(allDisplayTccs);
        setThemeFrequencies(freqs);
        if (freqs.length > 0 && !selectedTheme) {
          setSelectedTheme(freqs[0].tema);
        }
        setError(null);
      } catch (err) {
        console.error("Erro no GraficoPage ao buscar dados:", err);
        const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
        setError(`Falha ao carregar os dados dos TCCs: ${errorMessage}`);
        setAllTccs([]);
        setThemeFrequencies([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen mx-[40px] py-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#20E673] mb-4"></div>
        <h1 className="text-xl font-medium text-gray-300">Carregando dados... </h1>
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
      <h1 className="text-[24px] font-medium mb-6 text-gray-100">Mapa de Temas de TCC</h1>
      {themeFrequencies.length === 0 && !isLoading ? (
        <div className="mt-10 p-6 bg-[#222222] border border-[#525252] rounded-lg text-center">
          <p className="text-gray-300">Nenhum dado de TCC encontrado ou nenhum tema processado.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 flex flex-col gap-6">
            {themeFrequencies.length > 0 && <TreemapChart data={themeFrequencies} onSelectTheme={handleThemeSelect} />}
            <ThemeSelector themes={themeFrequencies} onSelectTheme={handleThemeSelect} selectedTheme={selectedTheme} />
          </div>

          <div className="lg:w-1/3">
            {selectedTheme && <TccDisplay allTccs={allTccs} selectedTheme={selectedTheme} />}
            {!selectedTheme && themeFrequencies.length > 0 && (
              <div className="p-6 bg-[#222222] border border-[#525252] rounded-lg text-gray-400">
                Selecione um tema no gráfico ou na lista para ver os detalhes.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GraficoPage;
