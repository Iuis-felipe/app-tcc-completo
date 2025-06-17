"use client";

import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';

// Importações necessárias para esta página
import { loadAllTccData } from "../../dataService";
import { CountByAuthor, countTccsByAuthor } from "@/utils/tccUtils";
import Header from "@/components/header";
import TopAuthorsChart from "@/components/TopAuthorsChart";

function OrientadoresPage() {
  const [topAuthors, setTopAuthors] = useState<CountByAuthor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // 1. Carrega todos os dados
        const { allProcessedTccs } = await loadAllTccData();

        // 2. Processa os dados especificamente para esta análise
        const authorData = countTccsByAuthor(allProcessedTccs);
        setTopAuthors(authorData);

        setError(null);
      } catch (err) {
        console.error("Erro na OrientadoresPage ao buscar dados:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
        setError(`Falha ao carregar os dados dos TCCs: ${errorMessage}`);
        setTopAuthors([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []); // Roda apenas uma vez ao carregar a página

  // Estados de Loading e Erro (padrão que já usamos)
  if (isLoading) {
    return (
      <div className="min-h-screen mx-[40px] py-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#20E673] mb-4"></div>
        <h1 className="text-xl font-medium text-gray-300">
          Carregando dados...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mx-[40px] py-8">
        <Header />
        <div className="mt-10 p-6 bg-[#222222] border border-[#525252] rounded-lg text-center">
          <h1 className="text-2xl font-semibold text-red-400 mb-3">
            Oops! Algo deu errado 😥
          </h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-[40px] py-8">
      <Header />
      <motion.h1
        className="text-[24px] font-medium mb-6 text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Professores que mais orientaram no TIC
      </motion.h1>

      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {topAuthors.length > 0 ? (
          <TopAuthorsChart data={topAuthors} />
        ) : (
          <div className="mt-10 p-6 bg-[#222222] border border-[#525252] rounded-lg text-center">
            <p className="text-gray-300">Nenhum dado de orientador encontrado para exibir.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default OrientadoresPage;